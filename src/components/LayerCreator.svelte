<script context="module" lang="ts">
	import GeoJsonLayer from './GeoJsonLayer.svelte';
    import LayerByIncome from './LayerByIncome.svelte';
    import Config from '../config';

    export function CreateLayer(config: Config) {
        const { name, url } = config;

        if (name == "New York City Income") {
            return {component: LayerByIncome, ...config};
        }

        return {component: GeoJsonLayer, ...config};
    }

</script>
