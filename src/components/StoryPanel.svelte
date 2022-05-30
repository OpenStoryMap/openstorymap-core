<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import { Panel, Header, Content } from '@smui-extra/accordion';
    import { LatLng, Map } from 'leaflet';

    import { mapStore, mapStateStore } from '../stores';
    import { MapState, Story } from '../config';
    import initImagePopup from '../popup';

    export let story: Story = null;
    let map: Map|undefined = undefined;
    let isOpen: boolean = false;

    $: {
        map = $mapStore;
    }

    onMount(async () => {
        initImageZoom();
    });

    function setMapState(mapState: MapState): void {
        if (!isOpen) {
            return;
        }

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

<Panel bind:open={isOpen} on:click={() => setMapState(story.mapState)}>
    <Header>{story.title}</Header>
    <Content>{@html story.content}</Content>
</Panel>
