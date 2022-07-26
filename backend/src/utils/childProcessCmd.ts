import path from 'path';
import { spawn } from 'child_process';
import winston from 'winston';

interface ChildProcessI {
  cmd: string;
  args?: any[];
  options?: any;
  logg?: boolean;
}

export const childProcessCmd = ({ cmd, args = [], logg = true, options }: ChildProcessI): Promise<any> => {
  const ServerLog = winston.loggers.get('server');
  return new Promise((resolve, reject) => {
    // log activity
    logg && ServerLog.info({ message: `sub-process:: `, data: `${cmd} ${args}`, path: __filename });

    // spawn commands
    const child = spawn(cmd, args, { cwd: path.join(process.cwd(), '..'), shell: true, ...options });
    child.stdout.on('data', async (data: any) => {
      // log activity
      logg && ServerLog.info({ message: data.toString(), data: `(${cmd} ${args !== undefined ? args : ''})`, path: __filename });

      resolve(data);
    });
    child.stderr.on('data', async (error: any) => {
      // log activity
      logg &&
        ServerLog.error({ message: error.toString(), data: `(${cmd} ${args !== undefined ? args : ''})`, path: __filename });

      reject(error);
    });
    child.on('close', async () => {
      resolve('done');
    });
  });
};

interface ChildProcessClbI {
  cmd: string;
  args?: any[];
  options?: any;
  stdout?: any;
  logg?: boolean;
}

export const childProcessCmdCallback = (
  { cmd, args, stdout = true, logg = true, options }: ChildProcessClbI,
  callback?: (arg: any) => void
) => {
  const ServerLog = winston.loggers.get('server');

  // log activity
  logg && ServerLog.info({ message: `sub-process-clb:: `, data: `${cmd} ${args}`, path: __filename });

  const child = spawn(cmd, args, { cwd: path.join(process.cwd(), '..'), shell: true, ...options });
  if (stdout) {
    child.stdout.on('data', async (data: any) => {
      // log activity
      logg && ServerLog.info({ message: data.toString(), data: `(${cmd} ${args !== undefined ? args : ''})`, path: __filename });
      typeof callback === 'function' && callback({ response: data, error: null });
    });
  } else {
    child.stderr.on('data', async (error) => {
      // log activity
      logg &&
        ServerLog.error({ message: error.toString(), data: `(${cmd} ${args !== undefined ? args : ''})`, path: __filename });

      typeof callback === 'function' && callback({ response: null, error });
    });
    child.on('close', async (code: any) => {
      typeof callback === 'function' && callback({ code });
    });
  }
};
