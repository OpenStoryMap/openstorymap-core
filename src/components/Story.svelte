<script lang="ts">
  import {LatLng, Map} from 'leaflet';
  import { onDestroy } from 'svelte';
  import { mapStore } from '../stores.js';

  let map: Map|undefined = undefined;

  const unsubscribe = mapStore.subscribe((newMap: Map|null) => {
    if (newMap != null) {
      map = newMap;
    }
  });

  onDestroy(unsubscribe);

  function panTo(): void {
    map?.panTo(new LatLng(40.68967735303955, -74.04534588323135));
  }
</script>

<button on:click={panTo}>Statue of Liberty</button>
