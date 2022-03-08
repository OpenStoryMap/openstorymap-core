<script lang="ts">
	import L from 'leaflet';
    import { getContext, onMount, onDestroy } from 'svelte';
	import GeoJsonLayer from './GeoJsonLayer.svelte';
    import { CreateLayer } from './LayerCreator.svelte';
    import Config from '../config';

    export let config: Config = undefined;
    let control = undefined;
    let layers = [];
    let layersMap = {};

    const map = getContext('map');

    onMount(() => {
        layers = config.layers.map(x => CreateLayer(x));
    });

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
        const { layer, name, url } = event.detail;
        control.addOverlay(layer, name);
        layersMap[name] = layer;
    };

    const removeLayer = (event: any) => {
        const { name, url } = event.detail;
        control.removeLayer(layersMap[name]);
        delete layersMap[name];
    }

</script>

<div style="display:hidden" use:createControl>
    {#if config}
        {#each layers as {component, ...props}}
            <svelte:component this={component} {...props} on:create-layer={addLayer} on:remove-layer={removeLayer}/>
        {/each}
    {/if}
</div>
