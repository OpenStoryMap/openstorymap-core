<script context="module" lang="ts">
	import GeoJsonLayer from './GeoJsonLayer.svelte';
    import LayerByIncome from './LayerByIncome.svelte';
    import type { Layer } from '../config';

    export function CreateLayer(layerConfig: Layer) {
        if (layerConfig.name === 'New York City Income') {
            return {component: LayerByIncome, ...layerConfig};
        }

        return {component: GeoJsonLayer, ...layerConfig};
    }

</script>
