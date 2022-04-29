import { writable, Writable } from 'svelte/store';

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
