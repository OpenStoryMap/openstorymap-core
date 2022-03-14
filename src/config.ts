export default interface Config {
  mapboxAccessToken: string,
  latLng: [number, number],
  zoom: number,
  layers: Layer[],
  stories: Story[]
}

export interface Layer {
  id: string,
  name: string,
  url: string,
  type: 'geojson'|'raster',
  controlProperties?: ControlProperty[]
}

export interface Story {
  title: string,
  content: string
}

export interface ControlProperty {
  id: string,
  type: 'slider',
  key?: string,
  prefixKey?: string
}
