<script lang="ts">
    /*
        This layer uses dynamic values from a list of values.
        The values per feature should be of the type 
        PrefixKey|value

        For example
        Test|100
        Test|200
        Test|300

        This connects to a slider and then will use the maximum value
        less than the slider value.

        Currently, the value is used to determine opacity of the feature outline
    */

    import { onMount, onDestroy } from 'svelte';
    import { Writable } from "svelte/store"
    import chroma from "chroma-js";
    import L from 'leaflet';

	import GeoJsonLayer from './GeoJsonLayer.svelte';
    import { GetOrCreateControlStore } from '../../stores';
    import type { Layer, LayerProperty, LayerByValueListArgs } from '../config';

    export let id: string;
    export let property: LayerProperty;
    export let args: LayerByValueListArgs;

    // these are things we can only load once mounted
    let layer: L.GeoJSON;
    let store: Writable;
    let keys: string[] = [];
    let key: string;
    let unsubscribe: (() => void);

    // FIXME types
    let colorChroma: any;

    onMount(() => {
        // FIXME hard-coded to connect to a slider.
        const id = `${property.id}.slider`;
        args = property.args;
        store = GetOrCreateControlStore(id);
        if (args.initialValue != null) {
            store.set(args.initialValue)
            key = `${args.prefixKey}|${args.initialValue}`;
        }
        colorChroma = chroma.scale([args?.colorStart ?? '#fff', args?.colorEnd ?? '#000']);
        unsubscribe = store.subscribe((x: number) => {
            const value = x;
            key = getMaxKey(value);

            if (layer != null) {
                layer.setStyle(onStyle);
            }
        });
    });

    onDestroy(unsubscribe);

    /**
    * This is a cumulative sum, so find the largest key less than the
    * slider value
    */
    const getMaxKey = (value) => {
        if (args.maxValue != null && value > args.maxValue) {
            return `${args.prefixKey}|All`; 
        }
        if (keys.length == 0) return;
        const filteredKeys = keys 
            .map(x => parseInt(x.split('|')[1]))
            .filter(x => x < value);
        return `${args.prefixKey}|${filteredKeys[filteredKeys.length - 1]}`;
    }


    /**
    *  Change the style so that the border changes color based on the percentage value
    */
    const onStyle = (feature) => {
        const opacity = feature.properties[key];
        return {
            fillOpacity: 0,
            opacity: 1,
            color: colorChroma(opacity),
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
    bind:layer={layer}
    id={id}
    property={property}
    onStyle={onStyle}
    on:create-layer
    on:remove-layer
    on:preprocess-data={preprocessData}
/>
