<script lang="ts">
  import { getContext, onMount, onDestroy } from 'svelte';
    import L from 'leaflet';
  import Slider from '@smui/slider';
  import { popupFeatureStore, popupLatlngStore } from '../stores.js';
  import Paper, { Title, Subtitle, Content } from '@smui/paper';
  import config from '../config';
  import { CreateControls } from './controls/ControlCreator.svelte';

  let unsubscribe: (() => void);
  const map = getContext('map');

  let popup;
  let content = null;
  let contentHtml: string = null;
  export let latlng;

  const layerInfoToHtml = (value) => {
    const featureTable = Object.entries(value['layer'][0].feature.properties)
        .map(x => `<tr><td>${x[0]}</td><td>${x[1]}</td></tr>`);

    return `<h3>${value['name']}</h3><br /><table>${featureTable.join('')}</table>`;
  }

  onMount(() => {
    var info = L.control();
    info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        this.update();
        return this._div;
    };

    // method that we will use to update the control based on feature properties passed
    info.update = function (props) {
        this._div.innerHTML = '<h4>US Population Density</h4>' +  (props ?
            '<b>' + props.name + '</b><br />' + props.density + ' people / mi<sup>2</sup>'
            : 'Hover over a state');
    };

    const leafletMap = map();
    //info.addTo(leafletMap);

    unsubscribe = popupFeatureStore.subscribe(value => {
        content = value;
        if (value != null && value.length > 0) {
            contentHtml = value.map(v => layerInfoToHtml(v)).join('<br />');
        } else {
            contentHtml = null;
        }
        if (popup == null && latlng != null && contentHtml != null) {
 
            popup = L.popup({autoPan: false}).setLatLng(latlng).setContent(contentHtml).openOn(leafletMap);
        }
        if (content == null && popup != null) {
            popup.removeFrom(leafletMap);
            popup = null;
        }
    });

    let unsubscribeLatlng = popupLatlngStore.subscribe(value => {
        latlng = value;
        if (popup != null) {
            popup.setLatLng(latlng);
        }
    });
  });

  onDestroy(unsubscribe);

</script>
