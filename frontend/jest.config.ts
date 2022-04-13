import type { Config } from '@jest/types';
// Or async function
// Sync object
const config: Config.InitialOptions = {
  verbose: true,
  transform: { '^.+\\.cjs$': 'babel-jest' }
};
export default config;
