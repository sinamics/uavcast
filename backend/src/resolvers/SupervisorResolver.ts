import path from 'path';
import { SupervisorRespons, VerctlRespons, VersionsRespons } from '../graphql-response-types/Supervisor';
import { Args, Mutation, Query, Resolver, Root, Subscription } from 'type-graphql';
import { paths } from '../config/paths';
import { socket } from '../utils/supervisor';
import { getApplicationVersionInput, SupervisorInput } from '../graphql-input-types/SupervisorInput';
import { getApplicationRepository } from '../entity/Application';
import winston from 'winston';
import { childProcessCmd } from '../utils/childProcessCmd';

const ServerLog = winston.loggers.get('server');
const verctl_bin = path.join(paths.binFolder, `verctl`);

@Resolver()
export class Supervisor {
  @Query(() => VersionsRespons)
  async getUavcastInformation(): Promise<any> {
    try {
      const uavcast = await childProcessCmd({
        cmd: verctl_bin,
        options: { cwd: paths.binFolder },
        args: ['-uavcastinformation'],
        logg: false
      });
      return { message: { uavcast: JSON.parse(uavcast.toString()) } };
    } catch (error) {
      return { errors: [{ message: error.error }] };
    }
  }
  @Query(() => VersionsRespons)
  async getSupervisorInformation(): Promise<any> {
    try {
      const supervisor = await childProcessCmd({
        cmd: verctl_bin,
        args: ['-supervisorinformation'],
        options: { cwd: paths.binFolder },
        logg: false
      });
      return { message: { supervisor: JSON.parse(supervisor.toString()) } };
    } catch (error) {
      return { errors: [{ message: error.error }] };
    }
  }
  @Query(() => VerctlRespons)
  async getAvailableVersions(@Args() { application }: getApplicationVersionInput): Promise<string> {
    const availVer = await childProcessCmd({
      cmd: verctl_bin,
      args: [`-${application}`],
      options: { cwd: paths.binFolder },
      logg: false
    });
    return JSON.parse(availVer.toString());
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
    subscribe: async (_: any, __: any, { PubSub }: any): Promise<any> => {
      return await PubSub.asyncIterator('U_SUPERVISOR_MESSAGE');
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
