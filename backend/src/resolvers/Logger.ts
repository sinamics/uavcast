import AppLogger from '../logger/ulog';
import { Args, Mutation, Query, Resolver } from 'type-graphql';
import { getLoggerRepository } from '../entity/Logger';
import {
  LoggDataResponse,
  LoggFilesResponse,
  LoggResponse,
  NetworkLoggDataResponse,
  WinstonResponse
} from '../graphql-response-types/LoggViewer';
import { LogFileInput, LogParametersInput, LogPeriodeInput, PruneLogsInput } from '../graphql-input-types/LogViewer';
import SystemLogger from '../logger';

@Resolver()
export class Logviewer {
  // Logviewer
  @Query(() => LoggFilesResponse)
  async getFileNames() {
    return { files: AppLogger.getAllFilenamesInLogfolder() };
  }

  @Query(() => LoggDataResponse)
  async getFileData(@Args() { filename }: LogFileInput) {
    const data = AppLogger.readFile(filename);
    return { data: JSON.stringify(data) };
  }

  @Query(() => LoggResponse)
  async getLoggData() {
    // return { logs: await Logger.findOne(1) };
  }

  @Query(() => LoggResponse)
  async getLoggerParameters() {
    return { logs: { ...(await getLoggerRepository().findOne(1)) } };
  }

  //enabling logging
  @Mutation(() => LoggResponse)
  async setLoggerParameters(@Args() { parameters }: LogParametersInput) {
    AppLogger.setActiveLogger(parameters);
    await getLoggerRepository().update(1, { ...parameters });
    return { logs: { ...(await getLoggerRepository().findOne(1)) } };
  }

  @Mutation(() => Boolean)
  async removeLogfile(@Args() { filename }: LogFileInput) {
    return AppLogger.deleteFile(filename);
  }
  @Mutation(() => Boolean)
  async removeAllLogfiles() {
    return AppLogger.deleteAllFiles();
  }

  //
  // SYSTEM LOGGER
  //
  @Query(() => WinstonResponse)
  async getTempLog(@Args() { properties }: LogPeriodeInput) {
    const System = SystemLogger.getLogger();
    const { dailyRotateFile: file }: any = await System.temperatureLogger.queryLogs({
      from: new Date().valueOf() - properties.minutes * 60 * 1000,
      until: new Date()
    });
    return { file };
  }

  //network
  @Query(() => NetworkLoggDataResponse)
  async getNetworkLog(@Args() { properties }: LogPeriodeInput) {
    const System = SystemLogger.getLogger();
    const { dailyRotateFile: file }: any = await System.networkLogger.queryLogs({
      from: new Date().valueOf() - properties.minutes * 60 * 1000,
      until: new Date()
    });
    return { file };
  }

  //cpu
  @Query(() => WinstonResponse)
  async getCpuLog(@Args() { properties }: LogPeriodeInput) {
    const System = SystemLogger.getLogger();
    const { dailyRotateFile: file }: any = await System.cpuLogger.queryLogs({
      from: new Date().valueOf() - properties.minutes * 60 * 1000,
      until: new Date()
    });
    return { file };
  }

  //dockerLogger
  @Mutation(() => WinstonResponse)
  async getDockerLog(@Args() { properties }: LogPeriodeInput) {
    const System = SystemLogger.getLogger();
    const { dailyRotateFile: file }: any = await System.dockerLogger.queryLogs({
      from: new Date().valueOf() - properties.minutes * 60 * 1000,
      until: new Date()
    });
    return { file };
  }
  //dockerLogger
  @Query(() => WinstonResponse)
  async getServerLog(@Args() { properties }: LogPeriodeInput) {
    const System = SystemLogger.getLogger();
    const { dailyRotateFile: file }: any = await System.serverLogger.queryLogs({
      from: new Date().valueOf() - properties.minutes * 60 * 1000,
      until: new Date()
    });
    return { file };
  }
  //
  // ALL LOGGERS
  //
  @Mutation(() => Boolean)
  async pruneLogFiles(@Args() { service }: PruneLogsInput) {
    SystemLogger.pruneLogFiles(service)
      // eslint-disable-next-line no-console
      .catch((err) => console.log(err));
  }
}
