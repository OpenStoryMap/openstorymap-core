import { writable, Writable } from 'svelte/store';

import config, { MapState } from './config';

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


export function setupMapStateStore(initialState: MapState) {
  const { subscribe, set, update } = writable(initialState);

  const _set = (mapState: MapState) => {
    if (mapState.controlPropertyValues != null) {
      mapState?.controlPropertyValues.forEach(item => {
        item.controlProperties?.forEach(c => {
          const id = `${item.layerId}.${c.controlPropertyId}`;
          const store = GetOrCreateControlStore(id, c.value);
          store.set(c.value);
        });
      });
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
    removeLayer: (layerId: string) => update(s => {
      // FIXME do we want to make this null if removing means an empty list?
      if (s.layers == null) return {...s, layers: [layerId]};

      return {...s, layers: s.layers.filter(x => x != layerId)};
    }),
    reset: () => set(initialState),
  };
}

export const mapStateStore = setupMapStateStore(config.initialMapState);
