import L from 'leaflet';

import type Config from '../config';

const layerStyle = {
  fillColor: "#FF00FF",
  fillOpacity: 1,
  color: '#B04173',
};

/**
 * Add a mapbox layer or openstreetmap layer depending on the config.
 *
 * Return a function to remove the layer. Used for onDestroy
 */
export function SetupBaseLayer(map: any, config: Config) {
  //const map = L.map('map').setView(config.latLng, config.zoom);

  const layer = config.mapboxAccessToken !== ''
    ? mapboxLayer(config.mapboxAccessToken)
    : openstreetmapLayer();

  layer.addTo(map);

  return () => map.removeFrom(layer);

  /*
  layers.forEach(layer => {
    leaflet.geoJSON(layer, {
      style: layerStyle,
      //onEachFeature: set actions for clicking polygon
    }).addTo(map); 
  })
  */
}

function mapboxLayer(accessToken: string) {
  return L.tileLayer(
    'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
    {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: accessToken
    }
  );
}

function openstreetmapLayer() {
  return L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }
  );
}
