<script lang="ts">
  import Slider from '@smui/slider';
  import { Writable, get } from "svelte/store"
  import { onMount, onDestroy } from 'svelte';
  import type { ControlProperty, LayerProperty, SliderRangeProperties } from '../../config';
  import Control from './Control.svelte';
  import { GetOrCreateControlStore } from '../../stores';

  export let layerProperty: LayerProperty;
  export let controlProperty: ControlProperty;

  let args: SliderRangeProperties;
  let store: Writable;

  let start: number;
  let end: number;

  onMount(() => {
    // FIXME move this function somewhere else
    const storeId = `${layerProperty.id}.${controlProperty.id}`;
    store = GetOrCreateControlStore(storeId);
    args = controlProperty.args as SliderRangeProperties;

    const storeValue = get(store);
    if (storeValue != null) {
        start = storeValue[0];
        end = storeValue[1];
    } else {
        // this means we just initialized, so set up the initial store value
        start = args.start;
        end = args.end;
        store.set([start, end]);
    }
  });

  // on changes, set the start and stop values
  $: {
    if (args !== undefined) {
      store.set([start, end]);
    }
  };

</script>


<Control layerProperty={layerProperty} controlProperty={controlProperty}>
    <!-- FIXME this is hacky and because of life cycle issues.
         the slider complains if this is undefined -->
    {#if start != null && end != null}
    <Slider
        bind:start={start}
        bind:end={end}
        range
        min={args?.min || 0}
        max={args?.max}
        step={args?.step}
        discrete
        input$aria-label=""
        color="secondary"
    />
    {/if}
</Control>

