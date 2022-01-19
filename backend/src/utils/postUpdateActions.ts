import pubsub, { getConStaus } from './pubsub';
import { getApplicationRepository } from '../entity/Application';
import winston from 'winston';

let interval: any;
const ServerLog = winston.loggers.get('server');

export const postUpdateActions = async () => {
  const data = await getApplicationRepository().findOne(1);

  if (data && data.hasBeenUpdated) {
    interval = setInterval(async () => {
      if (!getConStaus()) return null;
      ServerLog.info({ message: 'Application has been updated successfully', path: __filename });

      await pubsub.publish('U_SUPERVISOR_MESSAGE', {
        message: 'Application has been updated successfully.\n\nPlease refresh this window!\n\n\n\n'
      });

      data.hasBeenUpdated = false;
      data.save();

      return clearInterval(interval);
    }, 2000);
  }
};
