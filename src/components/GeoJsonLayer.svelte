<script lang="ts">
    import { getContext, createEventDispatcher } from 'svelte';
	import L from 'leaflet';
    import chroma from "chroma-js";

    export let id;
    export let url;
    export let name;
    export let onStyle = undefined;
    export let layer = undefined;
    let data = undefined;

    //const map = getContext('map');
    const colorChroma = chroma.scale(['#fff', '#000']);

    // to let the layer control know we made the layer
    const dispatch = createEventDispatcher();

    const createLayer = async (container) => {
        const response = await fetch(url);
        if (!response.ok) {
            return;
        }
        data = await response.json();

        //const leafletMap = map();
        layer = onStyle == null ? L.geoJSON(data) : L.geoJSON(data, {style: onStyle});
        dispatch('create-layer', {layer, url, name, id});

        return () => {
            //const leafletMap = map();
            //leafletMap.removeFrom(layer);
            dispatch('remove-layer', {url, name, id});
        }
    };

</script>

<div style="display:hidden" use:createLayer></div>
