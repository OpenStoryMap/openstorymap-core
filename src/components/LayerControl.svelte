<script lang="ts">
	import L from 'leaflet';
    import { getContext, onMount, onDestroy } from 'svelte';
	import GeoJsonLayer from './GeoJsonLayer.svelte';
    import Config from '../config';

    export let config: Config = undefined;
    let control = undefined;
    let layersMap = {};

    const map = getContext('map');

    const createControl = async (container) => {
        control = L.control.layers();
        const leafletMap = map();
        control.addTo(leafletMap);

        return () => {
            const leafletMap = map();
            leafletMap.remove(control);
        }
    };

    const addLayer = (event: any) => {
        console.log('add a layer');
        console.log(event.detail);
        const { layer, name, url } = event.detail;
        control.addOverlay(layer, name);
        layersMap[name] = layer;
    };

    const removeLayer = (event: any) => {
        console.log('remove a layer to prevent memory leak');
        const { name, url } = event.detail;
        control.removeLayer(layersMap[name]);
        delete layersMap[name];
    }

    console.log(config)

</script>

<div style="display:hidden" use:createControl>
    {#if config}
        {#each config.layers as layer}
            <GeoJsonLayer {...layer} on:create-layer={addLayer} on:remove-layer={removeLayer}/>
        {/each}
    {/if}
</div>
