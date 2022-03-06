import Config from './config';
import { initMap } from './map';

import './styles.scss';

import rawConfig from './config.json';

async function main(): Promise<void> {
  const config = rawConfig as Config;

  initMap(config);
}

main();
