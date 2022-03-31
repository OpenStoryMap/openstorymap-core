<script context="module" lang="ts">
    import type { SvelteComponent } from 'svelte';
    import type { Layer } from '../config';
    import GeoJsonLayer from './GeoJsonLayer.svelte';
    import GeotiffLayer from './GeotiffLayer.svelte';
    import GeoJsonOpacityLayer from './GeoJsonOpacityLayer.svelte';
    import LayerFilter from './LayerFilter.svelte';
    import LayerPlurality from './LayerPlurality.svelte';

    // FIXME this should be dynamic
    import LayerByValueList from './LayerByValueList.svelte';

    export async function CreateLayer(layerConfig: Layer): {component: SvelteComponent, layerConfig: Layer}{
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
        switch (layerConfig.property.type) {
            case 'geojson':
                component = GeoJsonLayer;
                break;
            case 'raster':
                component = GeotiffLayer;
                break;
            case 'geojson-opacity':
                component = GeoJsonOpacityLayer;
                break;
            case 'layer-with-filters':
                component = LayerFilter;
                break;
            case 'layer-plurality':
                component = LayerPlurality;
                break;
            case 'layer-by-value-list':
                component = LayerByValueList;
                break;
            default:
                console.warn(`Could not find a layer called ${layerConfig.property.type}`);
                component = undefined;
        }
        return {component, layerConfig};
    }

</script>
