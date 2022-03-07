<script lang="ts">
	import L from 'leaflet';
	import Map from './Map.svelte';
    import config from '../configs/config.json';
	//import Control from './Control.svelte';
	//import Marker from './Marker.svelte';
	//import Popup from './Popup.svelte';
	//import Polyline from './Polyline.svelte';
	//import MapToolbar from './MapToolbar.svelte';
	//import { scaleSequential } from 'd3-scale';
	//import { interpolateRainbow } from 'd3-scale-chromatic';
	let map;

    const center: number[] = [40.7107994, -74.122978,12];
    
    function resizeMap() {
        if(map) { map.invalidateSize(); }
    }
</script>
<svelte:window on:resize={resizeMap} />


<Map bind:map view={config.latLng} zoom={config.zoom} config={config}>
</Map>
