# OpenStoryMap

## Requirements

- Node 16

## Setup

```
npm install
```

Copy `src/configs/config.template.json` into a new file `src/configs/config.json` and update the config values. [Obtain a mapbox access token](https://account.mapbox.com/access-tokens/).

### Layers

Places GeoJSON and TIF files in `src/layers`, then update `src/configs/config.json` to include the added layer.

## Running

```
npm run dev
```
