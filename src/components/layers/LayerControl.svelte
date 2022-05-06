<script lang="ts">
    import L from 'leaflet';
    import { getContext, onMount, onDestroy } from 'svelte';

    import type { Config, Layer } from '../config';
    import GeoJsonLayer from './GeoJsonLayer.svelte';
    import { CreateLayer } from './LayerCreator.svelte';
    import { mapStateStore } from '../../stores';

    import _ from '../../plugins/L.Control.Opacity';

    export let config: Config|undefined = undefined;

    // FIXME types, but need to figure out leaflet types here
    let control: L.Control;
    let layers: L.Layer[] = [];
    let layersMap: {[key: string]: L.Layer} = {};
    let layerOrder: {[key: number]: string} = {};

    let opacityControl = null;

    const map = getContext('map');

    /**
    *   onMount creates promises that then resolve to create all configured layers
    */
    onMount(async () => {
        layerOrder = config.layers
            .map((l, i) => [i, l.property.id])
            .reduce((m, l) => {m[l[1]] = l[0]; return m;}, {});

        const layerPromises = config.layers.map((layerConfig: Layer) => CreateLayer(layerConfig));

        // await everything here, otherwise the components will try to load before they
        // are properly setup. For now, we will filter out any bad layers.
        layers = (await Promise.all(layerPromises)).filter(l => l.component !== undefined);
    });

    // when adding an overlay, mark the store based on the layer id
    const overlayAdd = (layer) => {
        mapStateStore.addLayer(layer.layer.options.oym_id)
    }

    // when removing an overlay, mark the store based on the layer id
    const overlayRemove = (layer) => {
        mapStateStore.removeLayer(layer.layer.options.oym_id)
    }

    $: createOpacityControl($mapStateStore.layers);

    const createOpacityControl = (layers) => {
        const leafletMap = map();
        if (opacityControl != null) {
            leafletMap.removeControl(opacityControl);
        }
        if (layers == null || layers.length == 0) return;
        // the opacity control will only show the layers that are visible
        const _layersMap = Object.fromEntries(
            Object.entries(layersMap)
                .filter(([name, layer]) => layers.indexOf(layer.options.oym_id) != -1));
        opacityControl = L.control.opacity(_layersMap, {label: 'Opacity'}).addTo(leafletMap);
    }

    const createControl = async (container) => {
        control = L.control.layers({}, {}, {
            sortLayers: true,
            // the sort function will match the order of the config file
            sortFunction: (a, b) => {
                return (layerOrder[a.options.oym_id] ?? 0) - (layerOrder[b.options.oym_id] ?? 0);
            }
        });
        const leafletMap = map();
        control.addTo(leafletMap);

        // add callbacks to adjust the store on the overlay change
        leafletMap.on('overlayadd', overlayAdd);
        leafletMap.on('overlayremove', overlayRemove);

        return () => {
            const leafletMap = map();
            leafletMap.remove(control);
        }
    };

    const addLayer = (event: any) => {
        const { layer, name, url, id } = event.detail;
        // add our custom options. there is no good function to recreate these
        // immutably, so mutably it is for now.
        layer.options.name = name;
        layer.options.oym_id = id;
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
