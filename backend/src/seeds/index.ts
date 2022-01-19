import { getLoggerRepository } from '../entity/Logger';
import { runSeeder } from 'typeorm-seeding';
import { CreateLogger } from './logger.seed';
import { getModemRepository } from '../entity/Modem';
import { CreateModem } from './modem.seed';
import { getCameraRepository } from '../entity/Camera';
import { CreateCamera } from './camera.seed';
import { getVpnRepository } from '../entity/Vpn';
import { CreateVpn } from './vpn.seed';
import { getApplicationRepository } from '../entity/Application';
import { CreateApplication } from './application.seed';
import winston from 'winston';
import { getFlightControllerRepository } from '../entity/FlightController';
import { CreateFlightController } from './flightController.seed';

const ServerLog = winston.loggers.get('server');

export const shouldSeed = async () => {
  if ((await getLoggerRepository().count()) === 0) {
    ServerLog.info({ message: 'Seeds logger database', path: __filename });
    runSeeder(CreateLogger);
  }
  if ((await getFlightControllerRepository().count()) === 0) {
    ServerLog.info({ message: 'Seeds FlightController database', path: __filename });
    runSeeder(CreateFlightController);
  }
  if ((await getModemRepository().count()) === 0) {
    ServerLog.info({ message: 'Seeds modem database', path: __filename });
    runSeeder(CreateModem);
  }
  if ((await getCameraRepository().count()) === 0) {
    ServerLog.info({ message: 'Seeds camera database', path: __filename });
    runSeeder(CreateCamera);
  }
  if ((await getVpnRepository().count()) === 0) {
    ServerLog.info({ message: 'Seeds vpn database', path: __filename });
    runSeeder(CreateVpn);
  }
  if ((await getApplicationRepository().count()) === 0) {
    ServerLog.info({ message: 'Seeds Application database', path: __filename });
    runSeeder(CreateApplication);
  }
};
