<script context="module" lang="ts">
	import GeoJsonLayer from './GeoJsonLayer.svelte';
    import Config from '../config';

    export function CreateLayer(config: Config) {
        const { name, url } = config;

        return {component: GeoJsonLayer, ...config};
    }

</script>
