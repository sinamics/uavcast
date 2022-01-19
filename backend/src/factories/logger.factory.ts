import { Logger } from '../entity/Logger';
import { define } from 'typeorm-seeding';

// pet.factory.ts
define(Logger, () => {
  const log = new Logger();
  log.altitude = true;
  log.cellSignal = true;
  log.satellites = true;
  return log;
});
