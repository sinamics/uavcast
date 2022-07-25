import { CameraActionResponse, CameraResponse } from '../graphql-response-types/CameraResponse';
import { Args, Query, Mutation, Resolver, Subscription, Root, PubSub, Publisher } from 'type-graphql';
import { Camera, getCameraRepository } from '../entity/Camera';
import { CameraActionInput, CameraInput } from '../graphql-input-types/CameraInput';
import { paths } from '../config/paths';
import { runSeeder } from 'typeorm-seeding';
import { CreateCamera } from '../seeds/camera.seed';
import winston from 'winston';
import path from 'path';
import { KernelResponse } from '../graphql-response-types/KernelResponse';
import { childProcessCmd, childProcessCmdCallback } from '../utils/childProcessCmd';

// status file
const cameraDeviceFile = path.join(paths.pythonFolder, 'devices.py');

@Resolver()
export class CameraResolver {
  @Mutation(() => CameraResponse)
  async updateCamera(@Args() { properties }: CameraInput): Promise<CameraResponse> {
    const camera: any = await getCameraRepository().findOne(1);
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
    const DockerLog = winston.loggers.get('docker');
    const camera = await getCameraRepository().findOne(1);
    if (!('playStream' in properties)) return { playStream: false };

    const playstatus = properties.playStream ? 'start' : 'stop';

    let stdioutMsg = '';
    switch (camera?.protocol) {
      case 'rtsp':
      case 'udp':
        childProcessCmdCallback(`/app/uavcast/bin/build/uav_main -v ${playstatus}`, null, true, (out: any) => {
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
    let availableCams: object[] = [];
    try {
      const cmd: object[] = await childProcessCmd('sudo python3', null, [cameraDeviceFile]);
      availableCams = JSON.parse(cmd.toString());
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error.toString());
    }

    availableCams.push({ key: 'custom_pipeline', value: 'custom_pipeline', text: 'Custom Pipeline' });
    availableCams.push({ key: 'custom_path', value: '', text: 'Custom Path' });

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
