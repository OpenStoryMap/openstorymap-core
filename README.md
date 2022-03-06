# OpenStoryMap

## Requirements

- Node 16

## Setup

```
npm install
```

Copy `src/config-template.json` into a new file `src/config.json` and update the config values. [Obtain a mapbox access token](https://account.mapbox.com/access-tokens/).

### Layers

Places GeoJSON files in `src/layers`, then update `src/layers.ts` to include the added layer.

## Running

```
npm run start
```

## Deployment

Make a build:
```
rm -r dist
npm run build
```

The package will be in the `dist` directory
