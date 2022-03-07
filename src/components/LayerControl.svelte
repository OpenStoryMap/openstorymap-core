<script lang="ts">
	import L from 'leaflet';
    import { getContext, onMount, onDestroy } from 'svelte';
	import GeoJsonLayer from './GeoJsonLayer.svelte';
    import Config from '../config';

    export let config: Config = undefined;
    let control = undefined;

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
        console.log(event);
    };

    const removeLayer = (event: any) => {
        console.log('remove a layer to prevent memory leak');
    }

    console.log(config)

</script>

<div style="display:hidden" use:createControl>
    {#if config}
        {#each config.layers as layer}
            <GeoJsonLayer url={layer.url} on:create-layer={addLayer} on:remove-layer={removeLayer}/>
        {/each}
    {/if}
</div>
