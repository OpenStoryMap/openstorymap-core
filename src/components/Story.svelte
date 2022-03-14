<script lang="ts">
  import {LatLng, Map} from 'leaflet';
  import { onDestroy } from 'svelte';
  import Slider from '@smui/slider';
  import { mapStore, layersStore, incomeSlider } from '../stores.js';
  import Paper, { Title, Subtitle, Content } from '@smui/paper';

  let map: Map|undefined = undefined;

  const unsubscribe = mapStore.subscribe((newMap: Map|null) => {
    if (newMap != null) {
      map = newMap;
    }
  });

  onDestroy(unsubscribe);

  function panTo(): void {
    map?.flyTo(new LatLng(40.68967735303955, -74.04534588323135), 15);
  }
</script>

<style>
    .panel {
        margin-bottom: 1rem;
    }
</style>

<div class="panel">
{#if $layersStore['Statue of Liberty']}
<Paper>
    <Title>Statue of Liberty</Title>
    <Subtitle>Pan to the Statue of Libery</Subtitle>
    <Content>
        <button on:click={panTo}>Statue of Liberty</button>
    </Content>
</Paper>
{/if}
</div>

<!-- hacky solution until I learn about the svelte css better. Otherwise, the if ignores the class -->
<div class="panel">
{#if $layersStore['New York City Income']}
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
