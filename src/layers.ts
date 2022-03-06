import * as geojson from 'geojson';

import statueOfLiberty from './layers/statue-of-liberty.json';
import maxHeatIndex from './layers/max-heat-index.json';

export default [
  maxHeatIndex as geojson.GeoJsonObject,
  statueOfLiberty as geojson.GeoJsonObject
] 
