<script context="module" lang="ts">
	import GeoJsonLayer from './GeoJsonLayer.svelte';
    import LayerByIncome from './LayerByIncome.svelte';
    import type { Layer } from '../config';

    export function CreateLayer(layer: Layer) {
        if (layer.property?.name === 'New York City Income') {
            return {component: LayerByIncome, ...layer.property};
        }

        return {component: GeoJsonLayer, ...layer.property};
    }

</script>
