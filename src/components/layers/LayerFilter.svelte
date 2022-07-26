<script lang="ts">
    /*
        Arguments

        colorFeatureProperty:   Feature argument for the fill color
        minColor:               Minimum color to used based on the domain of the colorFeatureProperty
        maxColor:               Maximum color to used based on the domain of the colorFeatureProperty
        null:                   Value used to filter domain values for min and max
        fillColor:              A static color to use for the fill color
                                The colorFeatureProperty property takes precedent if set
        color:                  Color for the outline of the shapes
        opacity:                Property for determining opacity

    */
    import { onMount, onDestroy } from 'svelte';
    import { derived } from 'svelte/store';
    import chroma from "chroma-js";
    import L from 'leaflet';

	import GeoJsonLayer from './GeoJsonLayer.svelte';
    import { GetOrCreateControlStore, mapStateStore, styleFuncStore } from '../../stores';
    import type { ControlProperty, Layer, LayerProperty, LayerByValueListArgs } from '../config';

    export let id: string;
    export let property: LayerProperty;
    export let controlProperties: ControlProperty[];
    export let args: LayerByValueListArgs;
    let data = null;

    // these are things we can only load once mounted
    let layer: L.GeoJSON;
    let storeMap: {[key: string]: any};  // FIXME what is this type?
    let valueStore: any;
    let valueMap: {[key: string]: number|[number, number]} = {};
    let includeNullMap: {[key: string]: boolean|null} = {};
    let valueMapKeys: string[] = [];
    let unsubscribe: (() => void);

    // these are used to keep track of our data ranges for colors
    let valueRangeKeys: string[] = [];
    let valueRanges: {[key: string]: [number, number]} = {};
    let colorFeatureProperty: string = null;

    // FIXME types
    let colorChroma: any;

    onMount(() => {
        colorChroma = chroma.scale([args?.minColor ?? '#fff', args?.maxColor ?? '#000']);
        storeMap = {};
        controlProperties?.forEach((c: any) => {
            // we can only have one fill color control
            const id = c.type == 'fillColor'
                ? `${property.id}.fillColor`
                : `${property.id}.${c.id}`;
            storeMap[id] = GetOrCreateControlStore(id);
            const valueMapKey = c.type == 'fillColor'
                ? 'fillColor'
                : c.id;
            valueMapKeys.push(valueMapKey);
            if (c.hideNull === true) {
                const idForNulls = `${id}.hideNull`;
                storeMap[idForNulls] = GetOrCreateControlStore(idForNulls);
                valueMapKeys.push(`${c.id}.hideNull`);
            }
        });

        const fillColor = controlProperties?.find(x => x.type == 'fill-color');
        if (fillColor != null) {
            valueRangeKeys = [...fillColor.args.include];
            colorFeatureProperty = fillColor.args.initialValue;
        }

        if (args.colorFeatureProperty && valueRangeKeys.indexOf(args.colorFeatureProperty) == -1) {
            valueRangeKeys.push(args.colorFeatureProperty);
            colorFeatureProperty = args.colorFeatureProperty;
        }

        // this has two args. I think the second one is some sort of set function
        valueStore = derived(Object.values(storeMap), (data, _) => {
            data.forEach((value, index) => {
                const key = valueMapKeys[index];
                if (key.endsWith('.hideNull')) {
                    includeNullMap[key] = value;
                } else if (key == 'fillColor') {
                    setColorChroma(value);
                } else {
                    valueMap[key] = value;
                }
            });

            // FIXME this should run in the top layer post-mount,
            // but that depends on lifecycle as child runs first
            if (layer != null) {
                styleFuncStore.updateStyleFunc(layer.options.oym_id, 'layerFilter', onStyle);
            }
        });
        unsubscribe = valueStore.subscribe((x: any) => { });
    });

    onDestroy(unsubscribe);

    const shouldHide = (feature) => {
        const properties = feature.properties;
        // return true if we should filter the layer
        const filtered = valueMapKeys.filter((k: string) => {
            if (k.endsWith('.hideNull')) {
                const key = k.replace('.hideNull', '');
                return (includeNullMap[k] === false && properties[key] == null);
            }
            const value = properties[k];
            const constraint = valueMap[k];
            if (constraint == null) return false;
            if (typeof(constraint) == 'number') {
                return value > constraint;
            }
            if (Array.isArray(constraint) && constraint.length == 2) {
                return value < constraint[0] || value > constraint[1];
            }

            // for now, ignore everything else
            console.log(`Problem with property ${k}`);
            return false;
        });
        return filtered.length > 0;
    }

    /*
    *  Eventually, we want to use a dynamic filter, but that will take a decent amount
    *  of additional work. See below
    *     https://stackoverflow.com/questions/16148598/leaflet-update-geojson-filter
    */
    const onStyle = (feature) => {
        const fillColor = colorFeatureProperty != null
            ? colorChroma(feature.properties[colorFeatureProperty])
            : args?.fillColor;

        const colors = ({
                ...(fillColor != null && {fillColor: fillColor}),
                ...(args?.color != null && {color: args.color}),
            })
        const hide = shouldHide(feature);
        const opacity = hide 
            ? 0
            : args?.opacity != null
            ? feature.properties[args.opacity]
            : 1;
        return {
            ...colors,
            fillOpacity: args?.fillOpacity != null ? args.fillOpacity : opacity * opacity,
            opacity: opacity,
        };
    }

    const legendFunc = () => {
        if (!args?.fillColor && !args?.color && !args?.minColor && !args.maxColor) {
            return '';
        }

        const background = args?.fillColor ? `background: ${args?.fillColor};` : '';
        const borderColor = args?.color ? `border-width: 2px; border-color: ${args?.color}; border-style: solid;` : '';
        const backgroundCss = (colorFeatureProperty != null
                && args?.minColor != null && args?.maxColor != null)
            ? `background-image: linear-gradient(to right, ${args.minColor}, ${args?.maxColor});`
            : ('' + background + borderColor);
        const legend = '<span style="'
            + backgroundCss
            + 'height: 20px; width: 100%;'
            + 'display: block; background-repeat: no-repeat;'
            + '"></span>' + property.name;
        return legend;
    }

    /**
    *   Preprocess the data to grab all available unique keys.
    *   This might use a little bit too much memory, but can be optimized later
    */
    const preprocessData = (event: any) => {
        const { data, url, name, id } = event.detail;

        valueRangeKeys.forEach(key => {
            const values = data.features
                .map(x => x.properties[key])
                .filter(x => x && x != args?.null);

            valueRanges[key] = [Math.min(...values), Math.max(...values)];
        });

        if (colorFeatureProperty != null) {
            setColorChroma(colorFeatureProperty);
        }
    }

    const setColorChroma = (key: string) => {
        if (key == null || valueRangeKeys.indexOf(key) == -1) {
            return;
        }

        colorFeatureProperty = key;
        colorChroma = colorChroma.domain(valueRanges[key]);
    }

</script>

<GeoJsonLayer
    bind:layer={layer}
    id={id}
    property={property}
    onStyle={onStyle}
    legendFunc={legendFunc}
    on:create-layer
    on:remove-layer
    on:preprocess-data={preprocessData}
/>
