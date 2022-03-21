<script lang="ts">
  import { LatLng, Map } from 'leaflet';
  import { onDestroy } from 'svelte';
  import { mapStore } from '../../stores.js';
  import type { ControlProperty } from '../../config';
  import Control from './Control.svelte';

  export let layerProperty: LayerProperty;
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

<Control layerProperty={layerProperty} controlProperty={controlProperty}>
    <button on:click={panTo}>Fly To {controlProperty.title || layerProperty.name}</button>
</Control>

<style>
</style>

