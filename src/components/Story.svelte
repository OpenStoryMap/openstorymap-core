<script lang="ts">
    import {LatLng, Map} from 'leaflet';
    import { onDestroy, onMount } from 'svelte';
    import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';

    import { mapStore, mapStateStore } from '../stores';
    import config, { MapState } from '../config';
    import initImagePopup from '../popup';

    let map: Map|undefined = undefined;

    const unsubscribe = mapStore.subscribe((newMap: Map|null) => {
        if (newMap != null) {
            map = newMap;
        }
    });

    onDestroy(unsubscribe);

    onMount(async () => {
        initImageZoom();
    });

    function setMapState(mapState: MapState): void {
        mapStateStore.set(mapState);
        map?.flyTo(new LatLng(mapState.lat, mapState.lng), mapState.zoom);
    }

    function initImageZoom() {
        const storyImages = document.querySelectorAll('#story-container img');
        if (storyImages) {
            for (const storyImage of Array.from(storyImages)) {
                storyImage.addEventListener('click', (event: Event) => {
                    initImagePopup(event);
                });
            }
        }
    }

</script>

<div id="story-container" class="accordion-container">
    <Accordion>
        {#each config.stories as story}
            <Panel on:click={() => setMapState(story.mapState)}>
                <Header>{story.title}</Header>
                <Content>{@html story.content}</Content>
            </Panel>
        {/each}
    </Accordion>
</div>
