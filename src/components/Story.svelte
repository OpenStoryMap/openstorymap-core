<script lang="ts">
    import {LatLng, Map} from 'leaflet';
    import { onDestroy } from 'svelte';
    import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';

    import { mapStore, mapStateStore } from '../stores';
    import config, { MapState } from '../config';


    let map: Map|undefined = undefined;

    const unsubscribe = mapStore.subscribe((newMap: Map|null) => {
        if (newMap != null) {
            map = newMap;
        }
    });

    onDestroy(unsubscribe);

    function setMapState(mapState: MapState): void {
        mapStateStore.set(mapState);
        map?.flyTo(new LatLng(mapState.lat, mapState.lng), mapState.zoom);
    }
</script>

<div class="accordion-container">
    <Accordion>
        {#each config.stories as story}
            <Panel on:click={() => setMapState(story.mapState)}>
                <Header>{story.title}</Header>
                <Content>{@html story.content}</Content>
            </Panel>
        {/each}
    </Accordion>
</div>
