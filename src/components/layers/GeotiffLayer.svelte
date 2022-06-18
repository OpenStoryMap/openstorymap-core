<script lang="ts">
    import { getContext, createEventDispatcher } from 'svelte';
	import L from 'leaflet';
    import chroma from "chroma-js";
    import type { LayerProperty, GeoTiffArgs } from '../../config';

    import parseGeoraster from "georaster";
    import GeoRasterLayer from 'georaster-layer-for-leaflet';

    const dispatch = createEventDispatcher();

    export let id: string;
    export let property: LayerProperty;
    export let args: GeoTiffArgs;

    let layer: L.Layer;
    // FIXME typing
    let data: any = undefined;
    const map = getContext('map');

    const legendFunc = () => {
        const colorStart = args?.colorStart || '#0f0';
        const colorStop = args?.colorStop || '#f00';
        const legend = '<span style="'
            + `background-image: linear-gradient(to right, ${colorStart}, ${colorStop});`
            + 'height: 20px; width: 100%;'
            + 'display: block; background-repeat: no-repeat;'
            + '"></span>' + property.name;
        return legend;
    }

    const createLayer = async (container) => {
        const response = await fetch(property.url);
        if (!response.ok) {
            return;
        }
        const arrayBuffer = await response.arrayBuffer();
        data = await parseGeoraster(arrayBuffer);

        const colorStart = args?.colorStart || '#0f0';
        const colorStop = args?.colorStop || '#f00';
        const colorChroma = chroma.scale([colorStart, colorStop]).domain([data.mins[0], data.maxs[0]]);
        //const colorChroma = chroma.scale(['#0f0', '#f00']).domain([data.mins[0], data.maxs[0]]);
        layer = new GeoRasterLayer({    
              georaster: data,
              opacity: 0.7,
              resolution: args?.resolution || 64,
              pixelValuesToColorFn: values => {
                  return values[0] > 0.0001 ? colorChroma(values[0]) : null;
              }         
          });

        dispatch('create-layer', {layer, url: property.url, name: property.name, id, legendFunc});

        return () => {
            dispatch('remove-layer', {url: property.url, name: property.name, id});
        }
    };

</script>

<div style="display:hidden" use:createLayer></div>
