<script lang="ts">
    import L from 'leaflet';
    import { getContext, onMount, onDestroy } from 'svelte';

    import leafletPip from '@mapbox/leaflet-pip';

    import type { Config, Layer } from '../config';
    import GeoJsonLayer from './GeoJsonLayer.svelte';
    import { CreateLayer } from './LayerCreator.svelte';
    import { layersStore, popupFeatureStore, popupLatlngStore } from '../../stores';

    import _ from '../../plugins/L.Control.Opacity';

    export let config: Config|undefined = undefined;

    // FIXME types, but need to figure out leaflet types here
    let control: L.Control;
    let layers: L.Layer[] = [];
    let layersMap: {[key: string]: L.Layer} = {};
    let layerIdByNameMap: {[key: string]: string} = {};
    let layersDisplayedMap: {[key: string]: any} = {};

    let opacityControl = null;

    const map = getContext('map');

    let mapMouseTimer: number = 1;

    /**
    *   onMount creates promises that then resolve to create all configured layers
    */
    onMount(async () => {
        const layerPromises = config.layers.map((layerConfig: Layer) => CreateLayer(layerConfig));
        // await everything here, otherwise the components will try to load before they
        // are properly setup. For now, we will filter out any bad layers.
        layers = (await Promise.all(layerPromises)).filter(l => l.component !== undefined);

        const leafletMap = map();
        leafletMap.on('mousemove', (e: any) => {
            var latlng = e.latlng;
            if (mapMouseTimer % 25 != 0) {
                mapMouseTimer += 1;
                return;
            }
            mapMouseTimer = 1
            popupLatlngStore.set(latlng);

            let intersections = [];
            Object.entries(layersDisplayedMap).forEach((key, layer) => {
                const intersection = leafletPip.pointInLayer(latlng, key[1]);
                if (intersection.length > 0) {
                    intersections = intersections.concat({name: key[0], layer: intersection});
                }
            });
            popupFeatureStore.set(intersections.length == 0 ? null : intersections);
        });
    });

    // when adding an overlay, mark the store based on the layer id
    const overlayAdd = (layer) => {
        const layerId = layerIdByNameMap[layer.name];
        $layersStore[layerId] = true;

        const leafletMap = map();
        if (opacityControl != null) {
            leafletMap.removeControl(opacityControl);
        }

        const layersDisplayed = Object.entries($layersStore)
            .filter(([name, displayed]) => displayed)
            .map(([name, _]) => name);
        layersDisplayedMap = Object.fromEntries(
            Object.entries(layersMap)
                .filter(([name, layer]) => layersDisplayed.indexOf(layerIdByNameMap[name]) != -1));
        opacityControl = L.control.opacity(layersDisplayedMap, {label: 'Opacity'}).addTo(leafletMap);
    }

    // when removing an overlay, mark the store based on the layer id
    const overlayRemove = (layer) => {
        const layerId = layerIdByNameMap[layer.name];
        $layersStore[layerId] = false;

        const leafletMap = map();
        if (opacityControl != null) {
            leafletMap.removeControl(opacityControl);
        }
        const layersDisplayed = Object.entries($layersStore)
            .filter(([name, displayed]) => displayed)
            .map(([name, _]) => name);
        layersDisplayedMap = Object.fromEntries(
            Object.entries(layersMap)
                .filter(([name, layer]) => layersDisplayed.indexOf(layerIdByNameMap[name]) != -1));
        opacityControl = L.control.opacity(layersDisplayedMap, {label: 'Opacity'}).addTo(leafletMap);
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
                controlProperties={layerConfig.controlProperties}
                args={layerConfig.property.args}
                on:create-layer={addLayer}
                on:remove-layer={removeLayer} />
        {/each}
    {/if}
</div>
