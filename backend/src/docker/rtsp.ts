import Docker from 'dockerode';
import { Camera } from '../entity/Camera';
import winston from 'winston';
import { PubSubEngine } from 'apollo-server-express';
import stream from 'stream';
//@ts-ignore
import finalStream from 'final-stream';

const ServerLog = winston.loggers.get('server');
const docker = new Docker({ socketPath: '/var/run/docker.sock' });

const stdout = new stream.PassThrough();

export const startRtspServer = (pubsub: PubSubEngine, entity: Camera): any =>
  new Promise((resolve, reject) => {
    docker.pull('mpromonet/v4l2rtspserver', (err: any, stream: any) => {
      if (err) {
        ServerLog.error({ message: err, path: __filename });
        reject(err);
      }
      docker.modem.followProgress(stream, onFinished, onProgress);
      async function onFinished(err: any, status: any) {
        //TODO promise not triggered when container starts, hence the resolve here.
        resolve(status[0]);
        if (!err) {
          stdout.pipe(process.stdout, { end: false });

          docker.run(
            'mpromonet/v4l2rtspserver',
            ['-u', 'uavcast', '-G', `${entity?.resolution}x${entity?.framesPrSecond}`],
            [stdout, stdout],
            {
              name: 'rtsp_stream',
              ExposedPorts: { '8554/udp:': {} },
              HostConfig: {
                NetworkMode: 'host',
                // CapAdd: ['ALL'],
                // PublishAllPorts: true,
                device: '/dev/video0',
                // PortBindings: {
                //   '8554/udp': [
                //     {
                //       HostPort: '8554'
                //     }
                //   ]
                // },
                Privileged: true,
                AutoRemove: true,
                Tty: false
              }
            }
          );

          stdout.on('data', async (data) => {
            await pubsub.publish('CAMERA_KERNEL_MESSAGE', { message: data.toString() });
          });
          //   console.log(stdout);
          //   await finalStream(stdout).then(async (buffer: any) => {
          //     await pubsub.publish('CAMERA_KERNEL_MESSAGE', { message: buffer.toString() });
          //   });
          //   console.log('stddd: ', stdout.pipe(process.stdout, { end: false }));
          //   await pubsub.publish('CAMERA_KERNEL_MESSAGE', { message: stdout.pipe(process.stdout, { end: false }) });
        } else {
          ServerLog.error({ message: err, path: __filename });
          reject(err);
        }
      }
      async function onProgress({ status }: any) {
        console.log('onProgress', err);
        await pubsub.publish('CAMERA_KERNEL_MESSAGE', { message: status });
        ServerLog.info({ message: status, path: __filename });
      }
    });
  });
export const stopRtspServer = (pubsub: PubSubEngine): any =>
  new Promise((resolve, reject) => {
    async () => {
      await pubsub.publish('CAMERA_KERNEL_MESSAGE', { message: 'stopping camera container' });
    };
    try {
      docker.getContainer('rtsp_stream').stop((err: any, data: any): any => {
        if (err) {
          ServerLog.error({ message: err, path: __filename });
          reject(false);
        }
        ServerLog.info({ message: 'rtsp_stream stopped', path: __filename });
        resolve(true);
      });
    } catch (error) {
      ServerLog.error({ message: error, path: __filename });
      reject(false);
    }
  });
