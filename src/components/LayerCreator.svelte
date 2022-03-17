<script context="module" lang="ts">
    import GeoJsonLayer from './GeoJsonLayer.svelte';
    import GeotiffLayer from './GeotiffLayer.svelte';
    import LayerByIncome from './LayerByIncome.svelte';
    import type { Layer } from '../config';

    export async function CreateLayer(layerConfig: Layer) {
        let component;
        /*
        // FIXME add this code back in when we get the rollup config to work properly.
        // As of now, the rollup makes one big bundle, which means we cannot dynamically
        // load these components. Leaving it here as a reminder.
        if (layerConfig.component !== undefined) {
            // TODO is there any sort of security issue here?
            component = (await import(`./${layerConfig.component}.svelte`)).default;
        }
        */
        component = layerConfig.type == 'geojson' ? GeoJsonLayer : GeotiffLayer;
        return {component, ...layerConfig};
    }

</script>
