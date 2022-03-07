import Config from './config';
import { initMap } from './utils/map';

import './styles.scss';

import rawConfig from './configs/config.json';

async function main(): Promise<void> {
  const config = rawConfig as Config;

  await initMap(config);
}

main();
