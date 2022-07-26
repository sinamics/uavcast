import path from 'path';
import { spawn } from 'child_process';
import winston from 'winston';

const ServerLog = winston.loggers.get('server');

interface ChildProcessI {
  cmd: string;
  args?: any[];
  options?: any;
  sensitiv?: boolean;
}

export const childProcessCmd = ({ cmd, args = [], sensitiv = false, options }: ChildProcessI): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (sensitiv) {
      // log activity
      ServerLog.info({ message: `sub-process:: `, data: `Sensitiv information, logging skipped!`, path: __filename });
    } else {
      // log activity
      ServerLog.info({ message: `sub-process:: `, data: `${cmd} ${args}`, path: __filename });
    }

    // spawn commands
    const child = spawn(cmd, args, { cwd: path.join(process.cwd(), '..'), shell: true, ...options });
    child.stdout.on('data', async (data: any) => {
      ServerLog.info({ message: data.toString(), data: `(command: ${cmd} ${args})`, path: __filename });
      resolve(data);
    });
    child.stderr.on('data', async (error: any) => {
      ServerLog.error({ message: error.toString(), data: `(command: ${cmd} ${args})`, path: __filename });
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
  sensitiv?: boolean;
}

export const childProcessCmdCallback = (
  { cmd, args, stdout = true, sensitiv = false, options }: ChildProcessClbI,
  callback?: (arg: any) => void
) => {
  if (sensitiv) {
    // log activity
    ServerLog.info({ message: `sub-process-clb:: `, data: `Sensitiv information, logging skipped!`, path: __filename });
  } else {
    // log activity
    ServerLog.info({ message: `sub-process-clb:: `, data: `${cmd} ${args}`, path: __filename });
  }
  const child = spawn(cmd, args, { cwd: path.join(process.cwd(), '..'), shell: true, ...options });
  if (stdout) {
    child.stdout.on('data', async (data: any) => {
      typeof callback === 'function' && callback({ response: data, error: null });
    });
  } else {
    child.stderr.on('data', async (error) => {
      ServerLog.error({ message: error.toString(), data: cmd, path: __filename });
      typeof callback === 'function' && callback({ response: null, error });
    });
    child.on('close', async (code: any) => {
      typeof callback === 'function' && callback({ code });
    });
  }
};
