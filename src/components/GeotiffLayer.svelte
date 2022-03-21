<script lang="ts">
    import { getContext, createEventDispatcher } from 'svelte';
	import L from 'leaflet';
    import chroma from "chroma-js";

    import parseGeoraster from "georaster";
    import GeoRasterLayer from 'georaster-layer-for-leaflet';

    const dispatch = createEventDispatcher();

    export let url;
    export let name;
    let data = undefined;
    let layer = undefined;
    const map = getContext('map');

    const createLayer = async (container) => {
        const response = await fetch(url);
        if (!response.ok) {
            return;
        }
        const arrayBuffer = await response.arrayBuffer();
        data = await parseGeoraster(arrayBuffer);

        const colorChroma = chroma.scale(['#0f0', '#f00']).domain([data.mins[0], data.maxs[0]]);
        layer = new GeoRasterLayer({    
              georaster: data,    
              opacity: 0.7,    
              resolution: 64,    
              pixelValuesToColorFn: values => {    
                  return values[0] > 1 ? colorChroma(values[0]) : null;    
              }         
          });

        dispatch('create-layer', {layer, url, name});
        return () => {
            dispatch('remove-layer', {url, name});
        }
    };

</script>

<div style="display:hidden" use:createLayer></div>
