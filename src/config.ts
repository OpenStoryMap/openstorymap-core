import config from './configs/config.json';


export interface Config {
    mapboxAccessToken: string,
    initialMapState: MapState,
    layers: Layer[],
    stories: Story[]
}

export interface Layer {
  property: LayerProperty,
  controlProperties?: ControlProperty[],
  // args depending on the type
  args?: LayerArgs
}

export interface LayerProperty {
  name: string,
  url: string,
  // FIXME layerByValueList is temporary until dynamic imports work
  type: 'geojson'|'raster'|'layerByValueList'
}

export interface Story {
    title: string,
    content: string,
    mapState: MapState
}

export interface ControlProperty {
  id: string,
  type: 'slider',  // FIXME add more
  name?: string,
  subtitle?: string,
  key?: string,
  args?: ControlPropertyArgs
}

// a union type of available control property arguments
export type ControlPropertyArgs = SliderProperties | GenericProperties

// FIXME this is just for demonstration purposes
export interface GenericProperties { }

// args for control properties
export interface SliderProperties {
  min?: number,
  max: number,
  step: number,
  multiplier: number,
  initialValue: any,
}

export interface SliderRangeProperties {
  min?: number,
  max: number,
  step: number,
  start: number,
  stop: number,
}

// a union type of available layer property arguments
export type LayerArgs = LayerByValueListArgs | GenericLayerArgs

export interface GenericLayerArgs {
  fillColor: string,
  color: string,
  opacity?: string,
}

// args for layer types
export interface LayerByValueListArgs {
  prefixKey: string,
  colorStart?: string,
  colorEnd?: string,
  maxValue?: number,
  maxValueLabel?: string,
  initialValue?: any,
}

// args for layer types
export interface LayerPluralityArgs {
  prefixKey: string,
  colorMap: {[key: string]: string}
}

// Control property settings that go in the map state
export interface ControlPropertyValues {
  layerId: string,
  opacity?: number[],
  controlProperties?: {controlPropertyId: string, value: number|[number, number]}[]
}

export interface MapState {
    lat: number,
    lng: number,
    zoom: number,
    // a list of the layers to show
    layers?: string[],
    // this is a mapping of control property id's to values
    controlPropertyValues?: ControlPropertyValues[]
}

export default config as Config;
