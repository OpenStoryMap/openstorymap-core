/*
 * Copied from
 * https://raw.githubusercontent.com/dayjournal/Leaflet.Control.Opacity/master/src/L.Control.Opacity.js
 *
 * But then tweaked to work with GeoJSON
 *
 */

import { styleFuncStore } from '../stores';


L.Control.Legend = L.Control.extend({
    options: {
        collapsed: false,
        position: 'bottomright',
        label: null,
    },
    initialize: function (layers, options) {
        L.Util.setOptions(this, options);
        this._layers = layers;
    },
    onAdd: function (map) {
        const htmls = Object.entries(this._layers).map(([label, layer]) => {
            return layer.options?.legendFunc != null
                ? layer.options.legendFunc()
                : '<span style="'
                    + 'height: 20px; width: 20px;'
                    + 'border-radius: 50%; display: inline-block;'
                    + 'background: green;'
                    + '"></span>'
                    + label;
        }).filter(x => x != '');


        if (!htmls.length) {
            return L.DomUtil.create('div', '');
        }

        var div = L.DomUtil.create('div', 'info legend ');
        L.DomUtil.addClass(div, 'leaflet-control-layers-expanded');
        div.innerHTML = '<fieldset><legend>Legend</legend>' + htmls.join('<br>') + '</fieldset>';
        return div;
    }
});

L.control.legend = function (overlays, options) {
    return new L.Control.Legend(overlays, options);
};
