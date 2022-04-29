<script lang="ts">
    import { getContext, createEventDispatcher } from 'svelte';
    import chroma from "chroma-js";
	import L from 'leaflet';

    import { popupFeatureStore } from '../../stores.js';
    import type { LayerProperty, GenericLayerArgs } from '../../config';

    export let id: string;
    export let property: LayerProperty;
    export let layer: L.Layer;
    export let args: GenericLayerArgs;
    // FIXME typing
    export let onStyle = undefined;
    let data = undefined;

    // to let the layer control know we made the layer
    const dispatch = createEventDispatcher();

    const defaultOnStyle = (feature) => {
        const colors = ({
                ...(args?.fillColor != null && {fillColor: args.fillColor}),
                ...(args?.color != null && {color: args.color}),
            })
        const opacity = args?.opacity != null ? feature.properties[args.opacity] : 1;
        return {
            ...colors,
            fillOpacity: opacity * opacity,
            opacity: opacity,
        };
    }

    const onEachFeature = (feature, layer) => {
        layer.on('mouseenter', (e: any) => {
            const name = property.name;
            popupFeatureStore.update(s => {
                return {...s, [name]: feature};
            });
            console.log(`mouseenter on ${id}`);
            console.log(feature);
            console.log(layer);
            console.log(e);
        });
        layer.on('mouseover', (e: any) => {
            const name = property.name;
            popupFeatureStore.update(s => {
                return {...s, [name]: feature};
            });
            console.log(`mouseover on ${id}`);
            console.log(feature);
            console.log(layer);
            console.log(e);
        });
        layer.on('mouseout', (e: any) => {
            popupFeatureStore.update(s => {
                const sNew = {...s};
                delete sNew[property.name];
                return sNew;
            });
            console.log(`mouseout on ${id}`);
            console.log(feature);
            console.log(layer);
            console.log(e);
        });
    }

    const createLayer = async (container) => {
        const response = await fetch(property.url);
        if (!response.ok) {
            return;
        }
        data = await response.json();
        dispatch('preprocess-data', {data, url: property.url, name: property.name, id});

        layer = onStyle == null
            ? L.geoJSON(data, {style: defaultOnStyle, onEachFeature})
            : L.geoJSON(data, {style: onStyle, onEachFeature});
        dispatch('create-layer', {layer,url: property.url, name: property.name, id});

        return () => {
            //const leafletMap = map();
            //leafletMap.removeFrom(layer);
            dispatch('remove-layer', {url: property.url, name: property.name, id});
        }
    };

</script>

<div style="display:hidden" use:createLayer></div>
