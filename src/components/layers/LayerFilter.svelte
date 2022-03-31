<script lang="ts">
    /*
    */
    import { onMount, onDestroy } from 'svelte';
    import { derived } from 'svelte/store';
    import chroma from "chroma-js";
    import L from 'leaflet';

	import GeoJsonLayer from './GeoJsonLayer.svelte';
    import { GetOrCreateControlStore } from '../../stores';
    import type { ControlProperty, Layer, LayerProperty, LayerByValueListArgs } from '../config';

    export let id: string;
    export let property: LayerProperty;
    export let controlProperties: ControlProperty[];
    export let args: LayerByValueListArgs;

    // these are things we can only load once mounted
    let layer: L.GeoJSON;
    let store: any;  // FIXME what is this type?
    let valueStore: any;
    let valueMap: {[key: string]: number|[number, number]} = {};
    let valueMapKeys: string[] = [];
    let unsubscribe: (() => void);

    // FIXME types
    let colorChroma: any;

    onMount(() => {
        args = property.args;
        colorChroma = chroma.scale([args?.colorStart ?? '#fff', args?.colorEnd ?? '#000']);
        let stores = []
        controlProperties.forEach((c: any) => {
            const id = `${property.id}.${c.id}`;
            stores.push(GetOrCreateControlStore(id));
            valueMapKeys.push(c.id);
        });
        // this has two args. I think the second one is some sort of set function
        valueStore = derived(stores, (data, _) => {
            data.forEach((value, index) => {
                valueMap[valueMapKeys[index]] = value;
            });

            if (layer != null) {
                layer.setStyle(onStyle);
            }
        });
        unsubscribe = valueStore.subscribe((x: any) => { });
    });

    onDestroy(unsubscribe);

    const shouldHide = (feature) => {
        const properties = feature.properties;
        // return true if we should filter the layer
        const filtered = valueMapKeys.filter((k: string) => {
            const value = properties[k];
            const constraint = valueMap[k];
            if (constraint == null) return false;
            if (typeof(constraint) == 'number') {
                return value > constraint;
            }
            if (Array.isArray(constraint) && constraint.length == 2) {
                return value < constraint[0] || value > constraint[1];
            }

            // for now, ignore everything else
            console.log(`Problem with property ${k}`);
            return false;
        });
        return filtered.length > 0;
    }

    /*
    *  Eventually, we want to use a dynamic filter, but that will take a decent amount
    *  of additional work. See below
    *     https://stackoverflow.com/questions/16148598/leaflet-update-geojson-filter
    */
    const onStyle = (feature) => {
        const colors = {
            ...(args?.fillColor != null && {fillColor: args.fillColor}),
            ...(args?.color != null && {color: args.color}),
        }
        const hide = shouldHide(feature);
        const opacity = hide 
            ? 0
            : args?.opacity != null
            ? feature.properties[args.opacity]
            : 1;
        return {
            ...colors,
            fillOpacity: opacity * opacity,
            opacity: opacity,
        };
    }
</script>

<GeoJsonLayer
    bind:layer={layer}
    id={id}
    property={property}
    on:create-layer
    on:remove-layer
/>
