<script lang="ts">
  import { onMount } from 'svelte';
  import Slider from '@smui/slider';
  import { layersStore, incomeSlider } from '../stores.js';
  import Paper, { Title, Subtitle, Content } from '@smui/paper';
  import config from '../configs/config.json';
  import { CreateControls } from './controls/ControlCreator.svelte';

  let controls = [];

  onMount(async () => {
      const controlPromises = CreateControls(config.layers);

      // await everything here, otherwise the components will try to load before they
      // are properly setup. For now, we will filter out any bad layers.
      controls = (await Promise.all(controlPromises)).filter(l => l.component !== undefined);
  });

</script>


<!-- hacky solution until I learn about the svelte css better. Otherwise, the if ignores the class -->
<div class="panel">
{#if $layersStore['NewYorkCityIncome'] == true}
<Paper>
    <Title>NYC INCOME - {$incomeSlider > 225 ? 'All' : `$${$incomeSlider * 1000}`}</Title>
    <Subtitle>Select income. Darker areas mean higher percentage below slider</Subtitle>
    <Content>
        <Slider
            bind:value={$incomeSlider}
            min={0}
            max={250}
            step={5}
            discrete
            input$aria-label=""
            color="secondary"
        />
    </Content>
</Paper>
{/if}
</div>

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

