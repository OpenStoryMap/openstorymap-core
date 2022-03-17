<script lang="ts">
    import L from 'leaflet';
    import { getContext, onMount, onDestroy } from 'svelte';
    import GeoJsonLayer from './GeoJsonLayer.svelte';
    import { CreateLayer } from './LayerCreator.svelte';
    import Config, { Layer } from '../config';

    import { layersStore } from '../stores.js';

    export let config: Config = undefined;
    let control = undefined;
    let layers = [];
    let layersMap = {};

    const map = getContext('map');

    onMount(async () => {
        const layerPromises = config.layers.map((layerConfig: Layer) => CreateLayer(layerConfig));
        // await everything here, otherwise the components will try to load before they
        // are properly setup
        layers = await Promise.all(layerPromises);
    });

    const overlayAdd = (layer) => {
        $layersStore[layer.name] = true;
    }

    const overlayRemove = (layer) => {
        $layersStore[layer.name] = false;
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
        const { layer, name, url } = event.detail;
        control.addOverlay(layer, name);
        layersMap[name] = layer;
        $layersStore[name] = false;
    };

    const removeLayer = (event: any) => {
        const { name, url } = event.detail;
        control.removeLayer(layersMap[name]);
        delete layersMap[name];
        delete $layersStore[name];
    }

</script>

<div style="display:hidden" use:createControl>
    {#if config}
        {#each layers as {component, ...props}}
            <svelte:component this={component} {...props} on:create-layer={addLayer} on:remove-layer={removeLayer}/>
        {/each}
    {/if}
</div>
