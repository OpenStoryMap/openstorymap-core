<script lang="ts">
	import L from 'leaflet';
    import { getContext, onMount, onDestroy } from 'svelte';
	import GeoJsonLayer from './GeoJsonLayer.svelte';
    import { CreateLayer } from './LayerCreator.svelte';
    import Config from '../config';

    import { layersStore } from '../stores.js';

    export let config: Config = undefined;
    let control = undefined;
    let layers = [];
    let layersMap = {};
    let layersNameToIdMap = {};

    const map = getContext('map');

    onMount(() => {
        layers = config.layers.map(x => CreateLayer(x));
    });

    const overlayAdd = (layer) => {
        const layerId = layersNameToIdMap[layer.name];
        $layersStore[layerId] = true;
    }

    const overlayRemove = (layer) => {
        const layerId = layersNameToIdMap[layer.name];
        $layersStore[layerId] = false;
    }

    const createControl = async (container) => {
        control = L.control.layers();
        const leafletMap = map();
        control.addTo(leafletMap);

        leafletMap.on('overlayadd', overlayAdd);
        leafletMap.on('overlayremove', overlayRemove);

        return () => {
            const leafletMap = map();
            leafletMap.remove(control);
        }
    };

    const addLayer = (event: any) => {
        const { layer, name, url, id } = event.detail;
        control.addOverlay(layer, name);
        layersMap[name] = layer;
        layersNameToIdMap[name] = id;
        $layersStore[id] = false;
    };

    const removeLayer = (event: any) => {
        const { name, url, id } = event.detail;
        control.removeLayer(layersMap[name]);
        delete layersMap[name];
        delete layersNameToIdMap[name];
        delete $layersStore[id];
    }

</script>

<div style="display:hidden" use:createControl>
    {#if config}
        {#each layers as {component, ...props}}
            <svelte:component this={component} {...props} on:create-layer={addLayer} on:remove-layer={removeLayer}/>
        {/each}
    {/if}
</div>
