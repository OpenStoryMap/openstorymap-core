<script lang="ts">
    /*
        This layer colors based on the highest value by prefix key

        For example
        Test|100
        Test|200
        Test|300

        Can find colors with https://colorbrewer2.org/#type=diverging&scheme=BrBG&n=9
    */

    import { onMount, onDestroy } from 'svelte';
    import { Writable } from "svelte/store"
    import chroma from "chroma-js";
    import L from 'leaflet';

	import GeoJsonLayer from './GeoJsonLayer.svelte';
    import { GetOrCreateControlStore } from '../../stores';
    import type { Layer, LayerProperty, LayerPluralityArgs } from '../config';

    export let id: string;
    export let property: LayerProperty;
    export let args: LayerPluralityArgs;

    // these are things we can only load once mounted
    let keys: string[] = [];
    let colorMap: {[key: string]: string} = {};

    // FIXME types
    let colorChroma: any;

    onMount(() => {
        args = property.args;
        colorMap = args.colorMap as LayerPluralityArgs;
    });

    /**
    *  Change the style so that the border changes color based on the percentage value
    */
    const onStyle = (feature) => {
        const properties = feature.properties;
        const key = keys.reduce((a, b) => properties[a] > properties[b] ? a : b);
        return {
            fillOpacity: 0,
            opacity: 1,
            color: colorMap[key.replace(`${args.prefixKey}|`, '')] ?? 'black',
            weight: 3,
        };
    }

    /**
    *   Preprocess the data to grab all available unique keys.
    *   This might use a little bit too much memory, but can be optimized later
    */
    const preprocessData = (event: any) => {
        const { data, url, name, id } = event.detail;
        keys = Array.from(new Set(
            data.features.map(
                x => Object
                    .keys(x.properties)
                    .filter(k => k.startsWith(`${args.prefixKey}|`))).flat()));
    }
        
</script>

<GeoJsonLayer
    id={id}
    property={property}
    onStyle={onStyle}
    on:create-layer
    on:remove-layer
    on:preprocess-data={preprocessData}
/>
