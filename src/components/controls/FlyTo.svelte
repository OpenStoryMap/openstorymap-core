<script lang="ts">
  import { LatLng, Map } from 'leaflet';
  import { onDestroy } from 'svelte';
  import { mapStore } from '../../stores.js';
  import type { ControlProperty } from '../../config';
  import Control from './Control.svelte';

  export let idLayer: string;
  export let nameLayer: string;
  export let controlProperty: ControlProperty = undefined;

  let map: Map|undefined = undefined;

  const unsubscribe = mapStore.subscribe((newMap: Map|null) => {
    if (newMap != null) {
      map = newMap;
    }
  });

  function panTo(): void {
    const { lat, lng, zoom } = controlProperty.args;
    map?.flyTo(new LatLng(lat, lng), zoom);
  }

  onDestroy(unsubscribe);
</script>

<Control nameLayer={nameLayer} idLayer={idLayer} controlProperty={controlProperty}>
    <button on:click={panTo}>Fly To {controlProperty.title || nameLayer}</button>
</Control>

<style>
</style>

