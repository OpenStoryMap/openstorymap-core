import config from './configs/config.json';


export interface Config {
    mapboxAccessToken: string,
    // FIXME typescript was unhappy with [number, number]
    latLng: number[],
    zoom: number,
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

// a union type of available layer property arguments
export type LayerArgs = LayerByValueListArgs | GenericLayerArgs

export interface GenericLayerArgs { }

// args for layer types
export interface LayerByValueListArgs {
  prefixKey: string,
  colorStart?: string,
  colorEnd?: string,
  maxValue?: number,
  maxValueLabel?: string,
  initialValue?: any,
}

export interface MapState {
    lat: number,
    lng: number,
    zoom: number
}

export default config as Config;
