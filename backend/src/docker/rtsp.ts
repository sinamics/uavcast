import Docker from 'dockerode';
import { Camera } from '../entity/Camera';
import winston from 'winston';
import { PubSubEngine } from 'apollo-server-express';
import stream from 'stream';

const ServerLog = winston.loggers.get('server');
const docker = new Docker({ socketPath: '/var/run/docker.sock' });

const rtsp_image_name = 'mpromonet/v4l2rtspserver:latest';

function containerLogs(container: any, pubsub: any) {
  const logStream = new stream.PassThrough();
  let logdata = '';
  logStream.on('data', async function (chunk) {
    ServerLog.info({ message: chunk.toString('utf8'), path: __filename });
    logdata = logdata + chunk.toString('utf8');
    await pubsub.publish('CAMERA_KERNEL_MESSAGE', { message: JSON.stringify(logdata) });
    // logger.info(chunk.toString('utf8'));
  });

  logStream.on('error', async function (chunk) {
    ServerLog.error({ message: 'errrrror::' + chunk.toString(), path: __filename });
    logdata = logdata + chunk.toString();
    await pubsub.publish('CAMERA_KERNEL_MESSAGE', { message: logdata });
    // logger.info(chunk.toString('utf8'));
  });
  container.logs(
    {
      follow: true,
      stdout: true,
      stderr: true
    },
    async function (err: any, stream: any) {
      if (err) {
        await pubsub.publish('CAMERA_KERNEL_MESSAGE', { message: JSON.stringify(err.toString('utf8')) });
        return ServerLog.error({ message: err.toString('utf8'), path: __filename });
      }
      container.modem.demuxStream(stream, logStream, logStream);
      stream.on('end', async function () {
        await pubsub.publish('CAMERA_KERNEL_MESSAGE', { message: 'camera has started' });
      });
      return true;
    }
  );
}

export const startRtspServer = (pubsub: PubSubEngine, entity: Camera): Promise<any> => {
  const container = new Promise(async (resolve, reject) => {
    try {
      const image = docker.getImage(rtsp_image_name);
      const inspect = await image.inspect();
      if (!inspect) throw Error('Image does not exsist');
      resolve(true);
    } catch (error) {
      ServerLog.error({ message: JSON.stringify(error), path: __filename });
      await docker.pull(rtsp_image_name, (err: any, stream: any) => {
        if (err) {
          ServerLog.error({ message: err, path: __filename });
          reject(err);
        }

        docker.modem.followProgress(
          stream,
          async (err: any, status: any) => {
            // onFinished
            if (err) {
              ServerLog.error({ message: err, path: __filename });
              await pubsub.publish('CAMERA_KERNEL_MESSAGE', { message: JSON.stringify(err) });
              reject(false);
            }
            //output is an array with output json parsed objects
            await pubsub.publish('CAMERA_KERNEL_MESSAGE', { message: status });
            resolve(true);
          },
          async (status) => {
            // onProgress
            await pubsub.publish('CAMERA_KERNEL_MESSAGE', { message: JSON.stringify(status) });
            ServerLog.info({ message: JSON.stringify(status), path: __filename });
          }
        );
      });
    }
  });
  container.then(async () => {
    try {
      const cont = await docker.createContainer({
        Image: rtsp_image_name,
        name: 'rtsp_stream',
        AttachStdin: true,
        AttachStdout: true,
        AttachStderr: true,
        // Tty: true,
        Cmd: ['-u', 'uavcast', '-G', `${entity?.resolution}x${entity?.framesPrSecond}`, entity?.cameraType],
        OpenStdin: false,
        StdinOnce: false,
        HostConfig: {
          Privileged: true,
          AutoRemove: true,
          NetworkMode: 'host'
        }
      });
      await cont.start();
      containerLogs(cont, pubsub);
    } catch (error) {
      ServerLog.error({ message: JSON.stringify(error), path: __filename });
      await pubsub.publish('CAMERA_KERNEL_MESSAGE', { message: JSON.stringify(error) });
    }
  });
  return container;
};

export const stopRtspServer = (pubsub: PubSubEngine): any =>
  new Promise((resolve, reject) => {
    async () => {
      await pubsub.publish('CAMERA_KERNEL_MESSAGE', { message: '>>> stopping camera container' });
    };
    try {
      docker.getContainer('rtsp_stream').stop(async (err: any, data: any) => {
        if (err) {
          ServerLog.error({ message: err, path: __filename });
          await pubsub.publish('CAMERA_KERNEL_MESSAGE', { message: JSON.stringify(err) });
          reject(false);
        }
        ServerLog.info({ message: 'rtsp_stream stopped', path: __filename });
        await pubsub.publish('CAMERA_KERNEL_MESSAGE', { message: '>>> rtsp stream stopped' });

        resolve(true);
      });
    } catch (error) {
      async () => {
        ServerLog.error({ message: error, path: __filename });
        await pubsub.publish('CAMERA_KERNEL_MESSAGE', { message: error.toString() });
        reject(false);
      };
    }
  });
