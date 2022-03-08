<script lang="ts">
    import { getContext, createEventDispatcher } from 'svelte';
	import L from 'leaflet';
    import chroma from "chroma-js";

    export let url;
    export let name;
    //export let onStyle: (feature) => any;
    let data = undefined;
    let layer = undefined;

    //const map = getContext('map');
    const colorChroma = chroma.scale(['#fff', '#000']);

    // to let the layer control know we made the layer
    const dispatch = createEventDispatcher();

    const onStyle = (feature) => {
        // set the opacity of the border based on percentage of population less than the income    
        const opacity = feature.properties[`Income|200000`];    
        return {      
            fillOpacity: 0,    
            opacity: 1,    
            color: colorChroma(opacity),    
            weight: 3,    
        };
    }

    const createLayer = async (container) => {
        const response = await fetch(url);
        if (!response.ok) {
            return;
        }
        data = await response.json();

        //const leafletMap = map();
        layer = L.geoJSON(data);
        dispatch('create-layer', {layer, url, name});

        return () => {
            //const leafletMap = map();
            //leafletMap.removeFrom(layer);
            dispatch('remove-layer', {url, name});
        }
    };

</script>

<div style="display:hidden" use:createLayer></div>
