import path from 'path';
import { spawn } from 'child_process';
import winston from 'winston';

const ServerLog = winston.loggers.get('server');

export const kernelCommands = (cmd: any, dir: any = path.join(process.cwd(), '..')): Promise<any> => {
  return new Promise((resolve, reject) => {
    ServerLog.info({ message: 'kernel command sent', data: cmd, path: __filename });
    const child = spawn(cmd, { cwd: dir, shell: true });
    child.stdout.on('data', async (data) => {
      resolve(data);
    });
    child.stderr.on('data', async (error) => {
      ServerLog.error({ message: error, data: cmd, path: __filename });
      reject(error);
    });
    child.on('close', async () => {
      resolve('done');
    });
  });
};
export const kernelCommandsCallback = (
  cmd: any,
  dir: any = path.join(process.cwd(), '..'),
  stdout = true,
  callback?: (arg: any) => void
) => {
  ServerLog.info({ message: 'kernel-callback command sent', data: cmd, path: __filename });
  const child = spawn(cmd, { cwd: dir, shell: true });
  if (stdout) {
    child.stdout.on('data', async (data: any) => {
      typeof callback === 'function' && callback(data);
    });
  } else {
    // child.stderr.on('data', async (error) => {
    //   ServerLog.error({ message: error.toString(), data: cmd, path: __filename });
    //   typeof callback === 'function' && callback(error);
    // });
    child.on('close', async (code: any) => {
      typeof callback === 'function' && callback(code);
    });
  }
};
