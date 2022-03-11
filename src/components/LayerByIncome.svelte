<script lang="ts">
	import GeoJsonLayer from './GeoJsonLayer.svelte';
    import { incomeSlider } from '../stores.js';
    import { onDestroy } from 'svelte';
    import chroma from "chroma-js";

    export let url;
    export let name;
    let layer;
    const colorChroma = chroma.scale(['#fff', '#000']);

    // just some arbitrary starting points
    let incomeLevel: number = 20000;
    let key: string = 'Income|20000';

    const keys = [
        'Income|10000',
        'Income|15000',
        'Income|20000',
        'Income|25000',
        'Income|30000',
        'Income|35000',
        'Income|40000',
        'Income|45000',
        'Income|50000',
        'Income|55000',
        'Income|75000',
        'Income|100000',
        'Income|125000',
        'Income|150000',
        'Income|200000',
        'Income|All',
    ];

    /**
    * This is a cumulative sum, so find the largest key less than the
    * slider value
    */
    const getMaxKey = (incomeLevel) => {
        if (incomeLevel > 225000) {
            return 'Income|All'; 
        }
        const incomeKeys = keys
            .map(x => parseInt(x.split('|')[1]))
            .filter(x => x < incomeLevel);
        return `Income|${incomeKeys[incomeKeys.length - 1]}`;
    }

    const unsubscribe = incomeSlider.subscribe((x: number) => {
        incomeLevel = x * 1000;
        key = getMaxKey(incomeLevel);

        if (layer != null) {
            layer.setStyle(onStyle);
        }
    });

    const onStyle = (feature) => {
        // set the opacity of the border based on percentage of population less than the income
        const opacity = feature.properties[key];
        return {
            fillOpacity: 0,
            opacity: 1,
            color: colorChroma(opacity),
            weight: 3,
        };
    }
</script>

<GeoJsonLayer bind:layer={layer} url={url} name={name} onStyle={onStyle} on:create-layer on:remove-layer/>
