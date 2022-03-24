<script lang="ts">
  import { onMount } from 'svelte';
  import Slider from '@smui/slider';
  import { layersStore, incomeSlider } from '../stores.js';
  import Paper, { Title, Subtitle, Content } from '@smui/paper';
  import config from '../config';
  import { CreateControls } from './controls/ControlCreator.svelte';

  let controls = [];

  onMount(async () => {
      const controlPromises = CreateControls(config.layers);

      // await everything here, otherwise the components will try to load before they
      // are properly setup. For now, we will filter out any bad layers.
      controls = (await Promise.all(controlPromises)).filter(l => l.component !== undefined);
  });
</script>

{#if config}
    {#each controls as {component, layerProperty, controlProperty}}
        {#if $layersStore[layerProperty.id] == true}
            <div class="panel">
                <svelte:component
                    this={component}
                    layerProperty={layerProperty}
                    controlProperty={controlProperty} />
            </div>
        {/if}
    {/each}
{/if}

<style>
    .panel {
        margin-bottom: 1rem;
    }
</style>
