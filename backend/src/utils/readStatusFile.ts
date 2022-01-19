import path from 'path';
import { spawn } from 'child_process';
// import Log from './logger';
import { paths } from '../config/paths';
import winston from 'winston';

const statusFile = path.join(paths.binFolder, 'uav_status');

let timeOutObject: ReturnType<typeof setTimeout>;
const ServerLog = winston.loggers.get('server');

export const getStatus = (pubsub: any) => {
  const current = {};
  let prev = {};

  function read(cb: any) {
    try {
      const child = spawn(statusFile);
      child.stdout.on('data', (data: any) => {
        if (!data) return ServerLog.info({ message: 'No data from status file!', path: __filename });
        const t = JSON.parse(data);

        for (const d in t) {
          //@ts-ignore
          current[d] = typeof t[d] === 'string' ? t[d].trim() : t[d];
        }
        return current;
        // Log.applicationState(current);
      });
      child.stderr.on('data', (err: any) => {
        // console.log(error.toString());
        ServerLog.info({ message: err, path: __filename });
      });
      child.on('exit', () => {
        // make sure it only send new status when it has changed
        if (JSON.stringify(current) === JSON.stringify(prev)) return cb();

        // send data to UI
        // Check if we should set green status led
        pubsub.publish('APPLICATION_STATUS', current);

        prev = JSON.parse(JSON.stringify(current));
        cb();
        child.kill();
      });
    } catch (error) {
      // console.log(error);
      ServerLog.info({ message: error, path: __filename });
    }
  }
  // wait 3sec after proccess has finished. No race condition
  function wait3sec() {
    if (timeOutObject) clearTimeout(timeOutObject);
    timeOutObject = setTimeout(() => {
      read(wait3sec);
    }, 5000);
  }
  read(wait3sec);
};
