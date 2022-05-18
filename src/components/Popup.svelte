<script lang="ts">
  import { getContext, onMount } from 'svelte';
  import L from 'leaflet';
  import leafletPip from '@mapbox/leaflet-pip';

  import { popupFeatureStore, popupLatlngStore } from '../stores.js';
  import { formatValue } from '../utils';
  import config from '../config';

  const map = getContext('map');

  let popup;
  let contentHtml: string = null;
  let layer: L.Layer = null;
  let feature = null;
  let displayMap = {}; // map from the config
  export let latlng;

  // FIXME add types
  const layerInfoToHtml = (value) => {
    const _displayMap = displayMap[value.id];
    if (_displayMap == null) {
        return '';
    }

    // update the name and value type based on the display map
    const featureTable = Object.entries(value.feature.properties)
        .filter(x => x[0] in _displayMap)
        .map(x => [_displayMap[x[0]]?.displayName ?? x[0], formatValue(x[1], _displayMap[x[0]]?.type)])
        .map(x => `<tr><td>${x[0]}</td><td>${x[1]}</td></tr>`);

    return `<h3>${value['name']}</h3><br /><table>${featureTable.join('')}</table>`;
  }

  /*
    FIXME add optimization to only check layers below the selected ones,
    as those are the only ones that can be hidden
  */
  const checkIntersection = () => {
    const leafletMap = map();
    const layers = [];
    let updatedContent = false;
    leafletMap?.eachLayer((l: L.Layer) => {
        if (l.options?.oym_id != null) {
            layers.push(l);
        }
    });

    let intersections = [];
    layers.forEach(_layer => {
        const oym_id = _layer.options.oym_id;

        // only check intersections if we are going to display something
        if (displayMap[oym_id] == null) {
            return;
        }

        // this is our main layer, so we are good
        if (Object.keys(layer._eventParents)[0] == _layer._leaflet_id) {
            intersections = intersections.concat({id: _layer.options.oym_id, name: _layer.options.name, feature: feature});
            return;
        }
        
        const intersection = leafletPip.pointInLayer(latlng, _layer);
        if (intersection.length > 0) {
            intersections = intersections.concat({id: _layer.options.oym_id, name: _layer.options.name, feature: intersection[0].feature});
        }
    });

    // only make changes if we have to
    if (intersections.length > 0) {
        const contentHtmlNew = intersections.map(v => layerInfoToHtml(v)).join('<br />');
        if (contentHtmlNew != contentHtml) {
            contentHtml = contentHtmlNew;
            updatedContent = true;
        }
    } else {
        contentHtml = null;
    }

    // don't recreate the popup unless we have to
    if (popup == null && latlng != null && contentHtml != null) {

        popup = L.popup({autoPan: false}).setLatLng(latlng).setContent(contentHtml).openOn(leafletMap);
    } else if ( popup != null ) {
        // otherwise, just adjust the popup
        popup.setLatLng(latlng);
        if (updatedContent) {
            popup.setContent(contentHtml);
        }
    }

    if (contentHtml == null && popup != null) {
        popup.removeFrom(leafletMap);
        popup = null;
    }
  }

  onMount(() => {
    // make a nested map of our properties
    displayMap = config.layers?.filter(x => x.property.displayProperties != null)
        .reduce((m, x) => {
            m[x.property.id] = x.property.displayProperties.reduce((m2, d) => {
                m2[d.id] = d;
                return m2;
            }, {});
            return m;
        }, {});

  });

  $: {
    layer = $popupFeatureStore.layer;
    feature = $popupFeatureStore.feature;

    latlng = $popupLatlngStore;
    if (layer != null) {
        checkIntersection();
        if (popup != null) {
            popup.setLatLng(latlng);
        }
    } else if (popup != null) {
        const leafletMap = map();
        popup.removeFrom(leafletMap);
        popup = null;
    }
  }

</script>
