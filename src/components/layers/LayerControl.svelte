<script lang="ts">
    import L from 'leaflet';
    import { getContext, onMount, onDestroy } from 'svelte';

    import type { Config, Layer } from '../config';
    import GeoJsonLayer from './GeoJsonLayer.svelte';
    import { CreateLayer } from './LayerCreator.svelte';
    import { layersStore } from '../../stores';

    export let config: Config|undefined = undefined;

    // FIXME types, but need to figure out leaflet types here
    let control: L.Control;
    let layers: L.Layer[] = [];
    let layersMap: {[key: string]: L.Layer} = {};
    let layerIdByNameMap: {[key: string]: string} = {};

    const map = getContext('map');

    /**
    *   onMount creates promises that then resolve to create all configured layers
    */
    onMount(async () => {
        const layerPromises = config.layers.map((layerConfig: Layer) => CreateLayer(layerConfig));
        // await everything here, otherwise the components will try to load before they
        // are properly setup. For now, we will filter out any bad layers.
        layers = (await Promise.all(layerPromises)).filter(l => l.component !== undefined);
    });

    // when adding an overlay, mark the store based on the layer id
    const overlayAdd = (layer) => {
        const layerId = layerIdByNameMap[layer.name];
        $layersStore[layerId] = true;
    }

    // when removing an overlay, mark the store based on the layer id
    const overlayRemove = (layer) => {
        const layerId = layerIdByNameMap[layer.name];
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
        layerIdByNameMap[name] = id;
        $layersStore[id] = false;
    };

    const removeLayer = (event: any) => {
        const { name, url } = event.detail;
        control.removeLayer(layersMap[name]);
        delete layersMap[name];
        delete $layersStore[name];
        delete layerIdByNameMap[name];
    }

</script>

<div style="display:hidden" use:createControl>
    {#if config}
        {#each layers as {component, layerConfig}}
            <svelte:component
                this={component}
                id={layerConfig.property.id}
                property={layerConfig.property}
                on:create-layer={addLayer}
                on:remove-layer={removeLayer} />
        {/each}
    {/if}
</div>
