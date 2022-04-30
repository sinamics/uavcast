import { CameraActionResponse, CameraResponse } from '../graphql-response-types/CameraResponse';
import { Args, Query, Mutation, Resolver, Subscription, Root, PubSub, Publisher } from 'type-graphql';
import { Camera, getCameraRepository } from '../entity/Camera';
import { CameraActionInput, CameraInput } from '../graphql-input-types/CameraInput';
import { spawn } from 'child_process';
import { paths } from '../config/paths';
import { runSeeder } from 'typeorm-seeding';
import { CreateCamera } from '../seeds/camera.seed';
import winston from 'winston';
import path from 'path';
import { KernelResponse } from '../graphql-response-types/KernelResponse';
import { kernelCommandsCallback } from '../utils/kernelCommands';

// status file
const cameraDeviceFile = path.join(paths.pythonFolder, 'devices.py');
const ServerLog = winston.loggers.get('server');
const DockerLog = winston.loggers.get('docker');

@Resolver()
export class CameraResolver {
  @Mutation(() => CameraResponse)
  async updateCamera(@Args() { properties }: CameraInput): Promise<CameraResponse> {
    const camera = await getCameraRepository().findOne(1);
    Object.assign(camera, properties);

    if (camera) await getCameraRepository().save(camera);

    const database = await getCameraRepository().findOne(1);
    return { database };
  }

  @Mutation(() => CameraActionResponse)
  async cameraActions(
    @PubSub('CAMERA_KERNEL_MESSAGE') publish: Publisher<any>,
    @Args() { properties }: CameraActionInput
  ): Promise<any> {
    const camera = await getCameraRepository().findOne(1);
    if (!('playStream' in properties)) return { playStream: false };

    const playstatus = properties.playStream ? 'start' : 'stop';

    let stdioutMsg = '';
    switch (camera?.protocol) {
      case 'rtsp':
      case 'udp':
        // const cmd = ['-u', 'uavcast', '-G', `${camera?.resolution}x${camera?.framesPrSecond}`, camera?.cameraType];

        kernelCommandsCallback(`/app/uavcast/bin/build/uav_main -v ${playstatus}`, null, true, (out: any) => {
          DockerLog.info({ message: out.toString(), path: __filename });
          stdioutMsg = stdioutMsg.concat(out.toString());
          publish({ message: stdioutMsg });
        });
        return true;

      default:
        return { playStream: false };
    }
  }
  @Query(() => CameraResponse)
  // @UseMiddleware(isAuth)
  async cameraData(): Promise<any> {
    const availableCams: object[] = await new Promise((resolve, reject) => {
      try {
        const child = spawn('sudo python3', [cameraDeviceFile], { shell: true });
        child.stdout.on('data', (data) => {
          if (data) {
            resolve(JSON.parse(data.toString('utf8')));
          }
          return reject([]);
        });
        child.stderr.on('data', async (data) => {
          ServerLog.error({ message: data.toString('utf8'), path: __filename });
          // reject(data.toString('utf8'));
        });
        child.on('exit', () => {
          reject([]);
          return child.kill();
        });
      } catch (ex) {
        ServerLog.error({ message: ex.message, path: __filename });
      }
    });

    availableCams.push({ key: 'custom', value: 'custom', text: 'Custom Pipeline', device: 'custom' });

    const database = await getCameraRepository().findOne(1);

    // Lets create a new row if db not exsist
    if (!database) return { database: await getCameraRepository().save(new Camera()), availableCams };

    //return data
    return { database, availableCams };
  }

  @Mutation(() => CameraResponse)
  async resetCameraDatabase(): Promise<any> {
    await getCameraRepository().delete(1);
    await runSeeder(CreateCamera);

    const database = await getCameraRepository().findOne(1);
    return { database };
  }
  @Subscription(() => KernelResponse, {
    topics: 'CAMERA_KERNEL_MESSAGE' // single topic
    // topics: ({ args, payload, context }) => args.topic // or dynamic topic function
    // filter: ():any => {
    //     console.log('object')
    // }
  })
  async camera_stdout(@Root() stdout: any): Promise<any> {
    // console.log('stdout', stdout);
    return { message: stdout.message, errors: stdout.errors };
  }
}
