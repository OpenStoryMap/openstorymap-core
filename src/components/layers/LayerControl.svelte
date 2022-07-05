<script lang="ts">
    import L from 'leaflet';
    import { getContext, onMount, onDestroy } from 'svelte';

    import type { Config, Layer } from '../config';
    import GeoJsonLayer from './GeoJsonLayer.svelte';
    import { CreateLayer } from './LayerCreator.svelte';
    import { mapStateStore } from '../../stores';

    import _ from '../../plugins/L.Control.Opacity';
    import _ from '../../plugins/Legend';

    export let config: Config|undefined = undefined;

    // FIXME types, but need to figure out leaflet types here
    let control: L.Control;
    let layers: L.Layer[] = [];
    let layersMap: {[key: string]: L.Layer} = {};
    let layerIdByNameMap: {[key: string]: string} = {};
    let layersDisplayedMap: {[key: string]: any} = {};
    let layerOrder: {[key: number]: string} = {};

    let opacityControl = null;
    let legendControl = null;

    // keep track of the original number of layers, then run a post-setup
    // function once we have loaded all layers.
    // we want to keep track of this layerCount here in case the number of layers changes
    let layersCount: number = 0;
    let initalLayers: string[] = [];
    let finishedPostSetup: boolean = false;

    const map = getContext('map');

    /**
    *   onMount creates promises that then resolve to create all configured layers
    */
    onMount(async () => {
        layerOrder = config.layers
            .map((l, i) => [i, l.property.id])
            .reduce((m, l) => {m[l[1]] = l[0]; return m;}, {});

        const layerPromisesInitial = config.layers
            .filter(x => config.initialMapState.layers.indexOf(x.property.id) > -1)
            .map((layerConfig: Layer) => CreateLayer(layerConfig));

        layers = (await Promise.all(layerPromisesInitial)).filter(l => l.component !== undefined);
    });

    const loadNonInitialLayers = async () => {
        const layerPromises = config.layers.filter(x => config.initialMapState.layers.indexOf(x.property.id) == -1).map((layerConfig: Layer) => CreateLayer(layerConfig));
        layersCount = config.layers.length;

        // await everything here, otherwise the components will try to load before they
        // are properly setup. For now, we will filter out any bad layers.
        layers = [...layers, ...(await Promise.all(layerPromises)).filter(l => l.component !== undefined)];

    };

    // when adding an overlay, mark the store based on the layer id
    const overlayAdd = (layer) => {
        mapStateStore.addLayer(layer.layer.options.oym_id)

        // preserve order by bringing all layers to the front in reverse order
        // FIXME use panes
        const leafletMap = map();
        const layersCurrent = [];
        leafletMap?.eachLayer((l: L.Layer) => {
            if (l.options?.oym_id != null) {
                layersCurrent.push(l);
            }
        });

        layersCurrent
            .sort((a, b) => layerOrder[a.options.oym_id] - layerOrder[b.options.oym_id])
            .reverse();
        layersCurrent.forEach(l => l.bringToFront());
    }

    // when removing an overlay, mark the store based on the layer id
    const overlayRemove = (layer) => {
        mapStateStore.removeLayer(layer.layer.options.oym_id)
    }

    // update the layers by checking what layers exist vs what we want to exist
    const updateLayers = (layers: string[]) => {
        const leafletMap = map();
        const layersCurrent = [];
        leafletMap?.eachLayer((l: L.Layer) => {
            if (l.options?.oym_id != null) {
                layersCurrent.push(l);
            }
        });
        const layersCurrentIds = layersCurrent.map(l => l.options.oym_id);

        // remove everything currently showing not included in the new list
        const layersToRemove =  layersCurrentIds.filter(oym_id => !layers.includes(oym_id));

        // add everything not currently showing from the new list
        const layersToAdd =  layers.filter(oym_id => !layersCurrentIds.includes(oym_id));

        layersToRemove.forEach(l =>
            leafletMap.removeLayer(layersMap[l])
        );
        layersToAdd.forEach(l =>
            leafletMap.addLayer(layersMap[l])
        );
    }

    $: {
        const layers = $mapStateStore.layers;
        if (finishedPostSetup) {
            if (layers != null) {
                updateLayers(layers);
            }

            createOpacityControl($mapStateStore.layers, $mapStateStore.controlPropertyValues);
            createLegendControl($mapStateStore.layers, $mapStateStore.controlPropertyValues);
        }
    }

    const createLegendControl = (_layers, _controlPropertyValues) => {
        const leafletMap = map();
        if (legendControl != null) {
            leafletMap.removeControl(legendControl);
        }
        if (_layers == null || _layers.length == 0) return;

        const layerIdToName = layers
            .map(l => l.layerConfig.property)
            .reduce((m, l) => {m[l.id] = l.name; return m;}, {});

        const _layersMap = Object.fromEntries(
            Object.entries(layersMap)
                .filter(([_, layer]: [string, L.Layer]) => _layers.indexOf(layer.options.oym_id) != -1)
                .map(([id, layer]: [string, L.Layer]) => [layerIdToName[id], layer])
            );

        legendControl = L.control
            .legend(_layersMap, { label: 'Legend', properties: layers.map(l => l.layerConfig.property) })
            .addTo(leafletMap);
    }

    const createOpacityControl = (_layers, _controlPropertyValues) => {
        const leafletMap = map();
        if (opacityControl != null) {
            leafletMap.removeControl(opacityControl);
        }
        if (_layers == null || _layers.length == 0) return;

        // use this mapping to add human readable names to the opacity control
        const layerIdToName = layers
            .map(l => l.layerConfig.property)
            .reduce((m, l) => {m[l.id] = l.name; return m;}, {});

        const filteredLayers = layers
            .map(l => l.layerConfig.property)
            .reduce((m, l) => {m[l.id] = l.ignoreOpacity ?? false; return m;}, {});

        // the opacity control will only show the layers that are visible
        const _layersMap = Object.fromEntries(
            Object.entries(layersMap)
                .filter(([_, layer]: [string, L.Layer]) => _layers.indexOf(layer.options.oym_id) != -1)
                .filter(([id, _]: [string, any]) => filteredLayers[id] !== true)
                .map(([id, layer]: [string, L.Layer]) => [layerIdToName[id], layer])
            );

        const opacityMap = _controlPropertyValues == null
            ? {}
            : _controlPropertyValues?.filter(x => x.opacity != null)
            .reduce((m, x) => {m[layerIdToName[x.layerId]] = x.opacity; return m;}, {});

        // everytime we change a layer, we recreate the opacity control. we also want to pull
        // some of the options from the old one
        opacityControl = L.control
            .opacity(
                _layersMap,
                { label: 'Opacity Control',
                  opacityMap: {...opacityMap, ...opacityControl?.options?.opacityMap }})
            .addTo(leafletMap);
    }

    const createControl = async (container) => {
        control = L.control.layers({}, {}, {
            autoZIndex: false,
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

    const addLayer = async (event: any) => {
        const { layer, name, url, id, legendFunc } = event.detail;
        // add our custom options. there is no good function to recreate these
        // immutably, so mutably it is for now.
        layer.options.name = name;
        layer.options.oym_id = id;
        layer.options.legendFunc = legendFunc;

        control.addOverlay(layer, name);
        layersMap[id] = layer;

        // once all the layers have loaded, run our post-setup script
        // and mark that we have finished running the post setup
        // afterwards, load all the other layers. This is for performance purposes
        if (!finishedPostSetup && config.initialMapState.layers.every(x => x in layersMap)) {
            postSetup();
            finishedPostSetup = true;
            await loadNonInitialLayers();
        }
    };

    const postSetup = () => {
        const initialLayers = config.initialMapState?.layers;
        if (initialLayers && initialLayers.length > 0) {
            mapStateStore.addLayers(initialLayers);
        }

        const initialControlPropertyValues = config.initialMapState?.controlPropertyValues;
        if (initialControlPropertyValues && initialControlPropertyValues.length > 0) {
            mapStateStore.setControlProperties(initialControlPropertyValues);
        }
    }

    const removeLayer = (event: any) => {
        const { name, url, id } = event.detail;
        control.removeLayer(layersMap[id]);
        delete layersMap[id];
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
