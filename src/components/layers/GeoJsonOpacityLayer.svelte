<script lang="ts">
    /* */
    import { onMount, onDestroy } from 'svelte';
    import { Writable } from "svelte/store"
    import L from 'leaflet';

	import GeoJsonLayer from './GeoJsonLayer.svelte';
    import { GetOrCreateControlStore } from '../../stores';
    import type { GenericLayerArgs, LayerProperty, LayerByValueListArgs } from '../config';

    export let id: string;
    export let property: LayerProperty;
    export let args: GenericLayerArgs;

    // these are things we can only load once mounted
    let layer: L.GeoJSON;
    let store: Writable;
    let opacity: number = 1;
    let unsubscribe: (() => void);

    onMount(() => {
        // FIXME hard-coded to connect to a slider.
        const id = `${property.id}.opacity`;
        store = GetOrCreateControlStore(id);
        unsubscribe = store.subscribe((x: number) => {
            opacity = x ?? 1;

            if (layer != null) {
                layer.setStyle(onStyle);
            }
        });
    });

    onDestroy(unsubscribe);

    /**
    *  Change the style so that the border changes color based on the percentage value
    */
    const onStyle = (feature) => {
        const colors = {
            ...(args?.fillColor != null && {fillColor: args.fillColor}),
            ...(args?.color != null && {color: args.color}),
        }
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
    onStyle={onStyle}
    args={args}
    on:create-layer
    on:remove-layer
/>

