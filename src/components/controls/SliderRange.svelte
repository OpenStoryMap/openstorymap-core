<script lang="ts">
  import Slider from '@smui/slider';
  import { Writable, get } from "svelte/store"
  import { onMount, onDestroy } from 'svelte';
  import Control from './Control.svelte';

  import Checkbox from '@smui/checkbox';
  import FormField from '@smui/form-field';

  import type { ControlProperty, LayerProperty, SliderRangeProperties } from '../../config';
  import { GetOrCreateControlStore } from '../../stores';
  import { formatValue } from '../../utils';

  export let layerProperty: LayerProperty;
  export let controlProperty: ControlProperty;

  let hideNull: boolean = true;
  let args: SliderRangeProperties;
  let store: Writable;
  let storeForNull: Writable;

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

    if (controlProperty.hideNull === true) {
        const storeForNullId = `${storeId}.hideNull`;
        storeForNull = GetOrCreateControlStore(storeForNullId);
    }
  });

  // on changes, set the start and stop values
  $: {
    if (args !== undefined) {
      store.set([start, end]);
    }
  };

  const toggleHideNull = (e) => {
    hideNull = !hideNull;
    storeForNull.set(hideNull);
  }

  const displayValue = (value: number) => controlProperty.valueDisplayType != null
    ? formatValue(value, controlProperty.valueDisplayType)
    : value;

</script>


<Control layerProperty={layerProperty} controlProperty={controlProperty}>
    <!-- FIXME this is hacky and because of life cycle issues.
         the slider complains if this is undefined -->
    <span slot="values">
        {#if start == end}
            Showing values equal to {displayValue(start)}
        {:else}
            Showing values between {displayValue(start)} and {displayValue(end)}
        {/if}
    </span>
    <span slot="control">
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

        {#if controlProperty.hideNull === true}
        <FormField>
            <Checkbox bind:hideNull on:change={toggleHideNull} />
            <span slot="label">hide missing data</span>
        </FormField>
        {/if}
    </span>
</Control>

