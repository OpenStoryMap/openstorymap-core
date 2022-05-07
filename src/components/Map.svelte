<script lang="ts">
    import { createEventDispatcher, setContext } from 'svelte';
    import L, { LatLng } from 'leaflet';

    import LayersControl from './layers/LayerControl.svelte';
    import type { Config } from '../config';
    import { mapStore } from '../stores.js';

    import 'leaflet/dist/leaflet.css';

    // Must set either bounds, or view and zoom.
    export let bounds = undefined;
    export let config: Config = undefined;
    let mapProp: L.Map|undefined = undefined;
    export { mapProp as map };

    export const invalidateSize = () => mapProp?.invalidateSize();

    const dispatch = createEventDispatcher();

    let map;
    $: mapProp = map;

    export const getMap = () => map;
    setContext('layerGroup', getMap);
    setContext('layer', getMap);
    setContext('map', getMap);

    /**
     * Add a mapbox layer.
     *
     * Return a function to remove the layer. Used for onDestroy
     */
    function setupBaseLayer(map: L.Map, config: Config): Function {
        const layer = L.tileLayer(
            'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
            {
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                maxZoom: 18,
                id: 'mapbox/streets-v11',
                tileSize: 512,
                zoomOffset: -1,
                accessToken: config.mapboxAccessToken
            }
        );

        layer.addTo(map);

        return () => layer.removeFrom(map);
    }

    function createLeaflet(node) {
        map = L.map(node, {preferCanvas: true}).on('zoom', (e) => dispatch('zoom', e));
        mapStore.set(map);

        if(bounds) {
            map.fitBounds(bounds)
        } else {
            const mapState = config.initialMapState;
            const view = new LatLng(mapState.lat, mapState.lng)
            map.setView(view, mapState.zoom);
        }

        const destroyLayer = setupBaseLayer(map, config);

        return {
            destroy() {
                destroyLayer();
                map.remove();
                map = undefined;
            },
        };
    }
</script> 

<div class="map-container" use:createLeaflet>
    {#if map}
        <slot {map}>
        <LayersControl {config} />
        </slot>
    {/if}
</div>

<style>
    :global(.leaflet-control-container) {
        position: static;
    }
    .map-container {
        height: 85vh;
        width: 100%;
    }

</style>

