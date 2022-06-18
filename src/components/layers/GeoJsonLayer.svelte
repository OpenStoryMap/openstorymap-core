<script lang="ts">
    import { getContext, createEventDispatcher } from 'svelte';
    import { get } from 'svelte/store';
    import chroma from "chroma-js";
	import L from 'leaflet';

    import { popupFeatureStore, styleFuncStore } from '../../stores';
    import type { LayerProperty, GenericLayerArgs } from '../../config';

    export let id: string;
    export let property: LayerProperty;
    export let layer: L.Layer;
    export let args: GenericLayerArgs;
    // FIXME typing
    export let onStyle = undefined;
    let data = undefined;
    export let legendFunc = () => {
        if (args?.fillColor == null) {
            return '';
        }
        const legend = '<span style="'
            + `background: ${args.fillColor};`
            + `border-width: 1px; border-color: ${args.color};`
            + 'height: 20px; width: 100%;'
            + 'display: block; background-repeat: no-repeat;'
            + '"></span>' + property.name;
        return legend;

    }

    // to let the layer control know we made the layer
    const dispatch = createEventDispatcher();

    $: {
        const _styleFuncs = $styleFuncStore;
        if (layer?.options?.oym_id in _styleFuncs) {
            layer.setStyle(_styleFuncs[layer.options.oym_id].onStyle);
            L.setOptions(layer, {...layer.options, style: onStyle});
        }
    }

    const defaultOnStyle = (feature) => {
        const colors = ({
                ...(args?.fillColor != null && {fillColor: args.fillColor}),
                ...(args?.color != null && {color: args.color}),
            })
        const opacity = args?.opacity != null ? feature.properties[args.opacity] : 1;
        return {
            ...colors,
            fillOpacity: args?.fillOpacity != null ? args.fillOpacity : opacity * opacity,
            opacity: opacity,
        };
    }

    const onEachFeature = (feature, layer) => {
        layer.on('mouseover', (e: any) => {
            const name = property.name;
            popupFeatureStore.update(s => {
                return {...s, feature, layer};
            });
        });
        layer.on('mouseout', (e: any) => {
            popupFeatureStore.update(s => {
                const sNew = {...s};
                delete sNew['feature'];
                delete sNew['layer'];
                return sNew;
            });
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
        dispatch('create-layer', {layer,url: property.url, name: property.name, id, legendFunc});

        return () => {
            dispatch('remove-layer', {url: property.url, name: property.name, id});
        }
    };

</script>

<div style="display:hidden" use:createLayer></div>
