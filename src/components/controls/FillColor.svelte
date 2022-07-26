<script lang="ts">
  import Radio from '@smui/radio';
  import FormField from '@smui/form-field';

  import { Writable, get } from "svelte/store"
  import { onMount, onDestroy } from 'svelte';
  import type { ControlProperty, LayerProperty, FillColorProperties } from '../../config';
  import Control from './Control.svelte';
  import { GetOrCreateControlStore } from '../../stores';

  export let layerProperty: LayerProperty;
  export let controlProperty: ControlProperty;
  let args: FillColorProperties;
  let include: string[] = [];

  let store: Writable;
  let value: number;

  onMount(() => {
    const id = `${layerProperty.id}.fillColor`;
    store = GetOrCreateControlStore(id);
    args = controlProperty.args as FillColorProperties;
    include = args.include;

    const storeValue = get(store);
    if (storeValue != null) {
        value = storeValue;
    } else {
        value = args.initialValue;
    }
  });

  $: {
    if (value !== undefined) {
      store.set(value);
    }
  };

</script>


<Control layerProperty={layerProperty} controlProperty={controlProperty}>
    <span slot="values"> </span>
    <span slot="control">
        {#each include as option}
            <FormField>
                <Radio
                    bind:group={value}
                    value={option}
                />

                <span slot="label">{option}<span>
            </FormField>
        {/each}
    </span>
</Control>

