import { spawn } from 'child_process';
import path from 'path';
import { SupervisorRespons, VerctlRespons, VersionsRespons } from '../graphql-response-types/Supervisor';
import { Args, Mutation, Query, Resolver, Root, Subscription } from 'type-graphql';
import { paths } from '../config/paths';
import { socket } from '../utils/supervisor';
import { getApplicationVersionInput, SupervisorInput } from '../graphql-input-types/SupervisorInput';
import { getApplicationRepository } from '../entity/Application';
import winston from 'winston';

const ServerLog = winston.loggers.get('server');

const getver: any = (application: string) => {
  const verctl_bin = path.join(paths.binFolder, `verctl`);

  return new Promise((resolve, reject) => {
    const child = spawn(verctl_bin, [`-${application}`]);
    child.stdout.on('data', async (data) => {
      // console.log('child', JSON.parse(data.toString()));
      resolve(JSON.parse(data.toString()));
    });
    child.stderr.on('data', async (error) => {
      // console.log('child', JSON.parse(error.toString()));
      ServerLog.error({ message: error.toString(), data: verctl_bin, path: __filename });
      reject({ error: error.toString() });
    });
    child.on('exit', function (exitCode) {
      if (exitCode === 0) {
        reject('Error');
      }
    });
  });
};

@Resolver()
export class Supervisor {
  @Query(() => VersionsRespons)
  async getUavcastInformation(): Promise<any> {
    try {
      const uavcast = await getver('uavcastinformation');
      return { message: { uavcast } };
    } catch (error) {
      return { errors: [{ message: error.error }] };
    }
  }
  @Query(() => VersionsRespons)
  async getSupervisorInformation(): Promise<any> {
    try {
      const supervisor = await getver('supervisorinformation');
      return { message: { supervisor } };
    } catch (error) {
      return { errors: [{ message: error.error }] };
    }
  }
  @Query(() => VerctlRespons)
  async getAvailableVersions(@Args() { application }: getApplicationVersionInput): Promise<string> {
    return await getver(application);
  }

  @Mutation(() => SupervisorRespons)
  async updateUavcastContainer(@Args() { version }: SupervisorInput): Promise<any> {
    if (!socket.connected) {
      ServerLog.error({ message: 'Supervisor not connected!', path: __filename });
      return {
        errors: [{ message: 'Supervisor not connected!', path: 'supervisor, DOWNLOAD_AND_UPDATE_UAVCAST_CONTAINER' }]
      };
    }

    // Set updated in database
    const data = await getApplicationRepository().findOne(1);
    if (!data) {
      await getApplicationRepository().insert({ hasBeenUpdated: true });
    } else {
      await getApplicationRepository().update(1, { hasBeenUpdated: true });
    }

    return new Promise((resolve, reject) => {
      socket.emit('DOWNLOAD_AND_UPDATE_UAVCAST_CONTAINER', version, ({ errors, message }: any) => {
        if (errors) {
          ServerLog.error({ message: errors, data: version, path: __filename });
          return reject({ errors });
        }
        resolve({ message });
      });
    });
  }
  @Mutation(() => SupervisorRespons)
  async updateSupervisorContainer(@Args() { version }: SupervisorInput): Promise<any> {
    if (!socket.connected) {
      ServerLog.error({ message: 'Supervisor not connected!', data: version, path: __filename });
      return {
        errors: [{ message: 'Supervisor not connected!', path: 'supervisor, DOWNLOAD_AND_UPDATE_UAVCAST_CONTAINER' }]
      };
    }

    return new Promise((resolve, reject) => {
      socket.emit('DOWNLOAD_AND_UPDATE_SUPERVISOR_CONTAINER', version, ({ errors, message }: any) => {
        if (errors) {
          ServerLog.error({ message: errors, data: version, path: __filename });
          return reject({ errors });
        }
        resolve({ message });
      });
    });
  }
  @Mutation(() => Boolean)
  async supervisorCommands(@Args() { type, command }: SupervisorInput): Promise<any> {
    return new Promise((resolve, reject) => {
      socket.emit(type, command, (errors: any, message: any) => {
        if (errors) {
          ServerLog.error({ message: errors, data: command, path: __filename });
          return reject({ errors });
        }
        resolve(message);
      });
    });
  }
  @Subscription(() => SupervisorRespons, {
    // topics: 'SUPERVISOR_MESSAGE' // single topic
    // topics: ({ args, payload, context }) => args.topic // or dynamic topic function
    // filter: (): any => {
    //   console.log('object');
    // }

    //@ts-ignore
    subscribe: async (_: any, __: any, { pubsub }: any): Promise<any> => {
      return await pubsub.asyncIterator('U_SUPERVISOR_MESSAGE');
    }
  })
  supervisor(@Root() supervisor: SupervisorRespons) {
    if ('errors' in supervisor) {
      ServerLog.error({ message: supervisor.errors, path: __filename });
      return { errors: [{ message: supervisor.errors, path: 'supervisor' }] };
    }

    return { message: supervisor.message };
  }
}
