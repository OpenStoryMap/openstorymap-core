<script lang="ts">
    import { Panel, Header, Content } from '@smui-extra/accordion';
    import { LatLng, Map } from 'leaflet';

    import { mapStore, mapStateStore } from '../stores';
    import { MapState, Story } from '../config';

    export let story: Story = null;
    let map: Map|undefined = undefined;
    let isOpen: boolean = false;

    $: {
        map = $mapStore;
    }

    function setMapState(mapState: MapState): void {
        if (!isOpen) {
            return;
        }

        mapStateStore.set(mapState);
        map?.flyTo(new LatLng(mapState.lat, mapState.lng), mapState.zoom);
    }

</script>

<Panel bind:open={isOpen} on:click={() => setMapState(story.mapState)}>
    <Header>{story.title}</Header>
    <Content>{@html story.content}</Content>
</Panel>
