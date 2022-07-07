<script lang="ts">
    import { Panel, Header, Content } from '@smui-extra/accordion';
    import { LatLng, Map } from 'leaflet';

    import { mapStore, mapStateStore } from '../stores';
    import { MapState, Story } from '../config';

    export let story: Story = null;
    let map: Map|undefined = undefined;
    let isGettingStarted: boolean = story.title == 'Getting Started';
    let isOpen: boolean = isGettingStarted;

    $: {
        map = $mapStore;
    }

    function setMapState(mapState: MapState): void {
        if (!isOpen || mapState == null) {
            return;
        }

        mapStateStore.set(mapState);
        map?.flyTo(new LatLng(mapState.lat, mapState.lng), mapState.zoom);
    }

</script>

<Panel variant="outlined" bind:open={isOpen} on:click={() => setMapState(story.mapState)}>
    <Header>{story.title}</Header>
    <Content class="story-content">{@html story.content}</Content>
</Panel>
