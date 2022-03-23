import { writable } from 'svelte/store';

export const mapStore = writable(null);

// the layers that are currently open
export const layersStore = writable({});

export const incomeSlider = writable(20);
