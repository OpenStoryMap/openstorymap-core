export interface Layer {
  url: string,
}

export default interface Config {
  mapboxAccessToken: string,
  latLng: [number, number],
  zoom: number,
  layers: Layer[]
}
