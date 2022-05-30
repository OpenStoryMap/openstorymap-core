import { writable, derived, Writable } from 'svelte/store';

import config, { ControlPropertyValues, MapState } from './config';

export const mapStore = writable(null);

// the layers that are currently open
// FIXME types
export const layersStore = writable({});

// FIXME types on that any. For now, this is ok as the store can actually store anything
const STORE_MAP: {[key: string]: any} = {}

/**
 * We will create one store per control. This store will be cached, as
 * there is no easy way to remove a svelte store (TODO: more research on this)
 * 
 * FIXME use generics
 */
export const GetOrCreateControlStore = (id: string, initialValue: any): Writable<any> => {

  if (id in STORE_MAP) {
    return STORE_MAP[id];
  }

  const store = writable(initialValue);
  STORE_MAP[id] = store;

  return store;
}

export const popupFeatureStore = writable([]);
export const popupLatlngStore = writable({});

export const mouseOverLayerId = writable('');

export function setupMapStateStore(initialState: MapState) {
  const { subscribe, set, update } = writable(initialState);

  const updateStoreValues = (controlPropertyValues: ControlPropertyValues[]) => {
    controlPropertyValues.forEach(item => {
      item.controlProperties?.forEach(c => {
        const id = `${item.layerId}.${c.controlPropertyId}`;
        const store = GetOrCreateControlStore(id, c.value);
        store.set(c.value);
      });
    });
  }

  const _set = (mapState: MapState) => {
    if (mapState.controlPropertyValues != null) {
      updateStoreValues(mapState.controlPropertyValues);
    }

    // when setting the mapState, if we don't have layers set explicity,
    // then use the layers that already exist
    update(m => {return {...mapState, layers: mapState.layers ?? m.layers}});
  }

  return {
    subscribe,
    update,
    set: _set,
    addLayer: (layerId: string) => update(s => {
      if (s.layers == null) return {...s, layers: [layerId]};

      return {...s, layers: [...s.layers, layerId]}
    }),
    addLayers: (layerIds: string[]) => update(s => {
      if (s.layers == null) return {...s, layers: layerIds};

      return {...s, layers: [...s.layers, ...layerIds]}
    }),
    removeLayer: (layerId: string) => update(s => {
      // FIXME do we want to make this null if removing means an empty list?
      if (s.layers == null) return {...s, layers: [layerId]};

      return {...s, layers: s.layers.filter(x => x != layerId)};
    }),
    setControlProperties: (controlPropertyValues: ControlPropertyValues[]) => {
      updateStoreValues(controlPropertyValues);
      update(m => {return {...m, controlPropertyValues}});
    },
    reset: () => set(initialState),
  };
}

export const mapStateStore = setupMapStateStore(config.initialMapState);

/*
 * A store to map layerId's to a mapping of style functions,
 * this way we can do things like change opacity separately from other features
 */
function setupStyleStore() {
  const _store = writable({});
  const _derived = derived([_store], ([$store]) => {
    return $store;
  });

  /*
   *    The updateFunc adds a style func to a mapping of functions by name.
   *    The functions are then combined with a reduce function to make a full
   *    onStyle. The opacity function is run last, as other functions may override opacity.
   *    For any function that sets opacity, the regular opacity function will multiply to
   *    preserve the relative opacity of other functions
   */
  const updateStyleFunc = (layerId: string, funcName: string, styleFunc: any) => _store.update((m: any) => {
      if (!(layerId in m) || !('onStyle' in m[layerId])) {
        return {...m, [layerId]: {[funcName]: styleFunc, onStyle: styleFunc }};
      } else {
        // remove the old onStyle function. we will replace this function later
        const { onStyle, ...mFuncs } = m[layerId];
        const mFuncsNew = {...mFuncs, [funcName]: styleFunc}
        // recreate the onStyle func here
        const _onStyle = (feature: any) => {
            // run all funcs from the mappings, but split out opacity to run later
            const { opacity, ...funcs } = mFuncsNew;
            let value = Object.entries(funcs).reduce((result: any, [_, func]: [any, any]) => {
              return {...result, ...func(feature)};
            }, {});

            // handle the opacity last, and use it as a multiplying factor
            if (opacity != null) {
              const opacityValues = opacity(feature);

              value = {...value,
                opacity: opacityValues.opacity * (value.opacity ?? 1),
                fillOpacity: opacityValues.fillOpacity * (value.fillOpacity ?? 1)
              };
            }
            return value;
        };
        return {...m, [layerId]: {...mFuncsNew, onStyle: _onStyle}};
      }
  });

  return {
    subscribe: _derived.subscribe,
    update: _store.update,
    set: _store.set,
    updateStyleFunc
  };
}

export const styleFuncStore = setupStyleStore();
