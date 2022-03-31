<script lang="ts">
    import { getContext, createEventDispatcher } from 'svelte';
    import chroma from "chroma-js";
	import L from 'leaflet';

    import type { LayerProperty, GenericLayerArgs } from '../../config';

    export let id: string;
    export let property: LayerProperty;
    export let layer: L.Layer;
    export let args: GenericLayerArgs;
    // FIXME typing
    export let onStyle = undefined;
    let data = undefined;

    //const map = getContext('map');
    const colorChroma = chroma.scale(['#fff', '#000']);

    // to let the layer control know we made the layer
    const dispatch = createEventDispatcher();

    const createLayer = async (container) => {
        const response = await fetch(property.url);
        if (!response.ok) {
            return;
        }
        data = await response.json();
        dispatch('preprocess-data', {data, url: property.url, name: property.name, id});

        layer = onStyle == null ? L.geoJSON(data) : L.geoJSON(data, {style: onStyle});
        dispatch('create-layer', {layer, url: property.url, name: property.name, id});

        return () => {
            //const leafletMap = map();
            //leafletMap.removeFrom(layer);
            dispatch('remove-layer', {url: property.url, name: property.name, id});
        }
    };

</script>

<div style="display:hidden" use:createLayer></div>
