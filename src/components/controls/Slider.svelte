<script lang="ts">
  import Slider from '@smui/slider';
  import { Writable, get } from "svelte/store"
  import { onMount, onDestroy } from 'svelte';
  import type { ControlProperty, LayerProperty, SliderProperties } from '../../config';
  import Control from './Control.svelte';
  import { GetOrCreateControlStore } from '../../stores';

  export let layerProperty: LayerProperty;
  export let controlProperty: ControlProperty;
  let args: SliderProperties;

  let store: Writable;
  let value: number;

  onMount(() => {
    // FIXME move this function somewhere else
    const id = `${layerProperty.id}.${controlProperty.id}`;
    store = GetOrCreateControlStore(id);
    args = controlProperty.args as SliderProperties;

    const storeValue = get(store);
    if (storeValue != null) {
        value = storeValue / (args.multiplier ?? 1);
    } else {
        value = args.initialValue;
    }
  });

  $: {
    if (args !== undefined) {
      const valueMultiplier = value * (args.multiplier ?? 1);
      store.set(valueMultiplier);
    }
  };

</script>


<Control layerProperty={layerProperty} controlProperty={controlProperty}>
    <!-- FIXME this is hacky and because of life cycle issues.
         the slider complains if this is undefined -->
    <span slot="values"> </span>
    <span slot="control">
    {#if value != null}
    <Slider
        bind:value={value}
        min={args?.min || 0}
        max={args?.max}
        step={args?.step}
        discrete
        input$aria-label=""
        color="secondary"
    />
    {/if}
    </span>
</Control>

