import * as leaflet from 'leaflet';

import Config from './config';
import layers from './layers';

const layerStyle = {
  fillColor: "#FF00FF",
  fillOpacity: 1,
  color: '#B04173',
};

export async function initMap(config: Config) {
  const map = leaflet.map('map').setView([40.74587128711968, -74.04400383097374], 13);

  leaflet.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: config.mapboxAccessToken
  }).addTo(map);

  layers.forEach(layer => {
    leaflet.geoJSON(layer, {
      style: layerStyle,
      //onEachFeature: set actions for clicking polygon
    }).addTo(map); 
  })
}
