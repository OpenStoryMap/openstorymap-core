<script context="module" lang="ts">
    import FlyTo from './FlyTo.svelte';
    import Control from './Control.svelte';
    //import Slider from './Slider.svelte';
    import type { ControlProperty } from '../config';

    export async function CreateControl(controlProperty: ControlProperty, idLayer: string, nameLayer: string?) {
        let component;

        switch (controlProperty.type) {
            case 'flyTo':
                component = FlyTo;
                break;
            default:
                component = Control;
        }
        return {component, name, idLayer, nameLayer, ...controlProperty };
    }

</script>

