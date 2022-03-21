<script context="module" lang="ts">
    import FlyTo from './FlyTo.svelte';
    import Control from './Control.svelte';
    //import Slider from './Slider.svelte';
    import type { Layer, ControlProperty, LayerProperty } from '../config';

    // NOTE: this is async in antication for dynamically loading components. that feature is async.
    export async function CreateControl(controlProperty: ControlProperty, layerProperty: LayerProperty) {
        let component;

        switch (controlProperty.type) {
            case 'flyTo':
                component = FlyTo;
                break;
            default:
                component = Control;
        }
        return {component, controlProperty, layerProperty};
    }

    /**
     * Given a list of layers, flatten out the layers with the control properties
     * to return a list of promises that will resolve into control components
     */
    export function CreateControls(layers: Layer[]) {
        return layers
            .map(layer => layer.controlProperties?.map(controlProperty => {
                return {controlProperty, layerProperty: layer.property};}))
            .flat()
            .filter(x => x !== undefined)
            .map(({controlProperty, layerProperty}) => CreateControl(controlProperty, layerProperty));
    }

</script>

