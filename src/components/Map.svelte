<script lang="ts">
    import { createEventDispatcher, setContext, onMount } from 'svelte';
    import L from 'leaflet';
    import 'leaflet/dist/leaflet.css';
    import LayersControl from './LayerControl.svelte';
    import GeotiffLayer from './GeotiffLayer.svelte';
    import Config from '../config';
    import { SetupBaseLayer } from '../utils/map';
    import { mapStore } from '../stores.js';

    // Must set either bounds, or view and zoom.
    export let bounds = undefined;
    export let view = undefined;
    export let zoom: number = undefined;
    export let config: Config = undefined;
    let mapProp = undefined;
    export { mapProp as map };

    export const invalidateSize = () => map?.invalidateSize();

    const dispatch = createEventDispatcher();

    let map;
    $: mapProp = map;

    export const getMap = () => map;
    setContext('layerGroup', getMap);
    setContext('layer', getMap);
    setContext('map', getMap);

    function createLeaflet(node) {
        map = L.map(node).on('zoom', (e) => dispatch('zoom', e));
        mapStore.set(map);

        if(bounds) {
            map.fitBounds(bounds)
        } else {
            map.setView(view, zoom);
        }

        const destroyLayer = SetupBaseLayer(map, config);

        return {
            destroy() {
                destroyLayer();
                map.remove();
                map = undefined;
            },
        };
    }

    $: if(map) {
        if(bounds) {
            map.fitBounds(bounds)
        } else {
            map.setView(view, zoom);
        }
    }
</script> 

<div class="map-container" use:createLeaflet>
    {#if map}
        <slot {map}>
        <LayersControl {config} />
        <GeotiffLayer url={"rasters/af_hi_f.tif"} />
        </slot>
    {/if}
</div>

<style>
    :global(.leaflet-control-container) {
        position: static;
    }
    .map-container {
        height: 90vh;
        width: 100%;
    }

</style>

