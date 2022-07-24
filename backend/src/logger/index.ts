import fs from 'fs';
import path from 'path';
import { paths } from '../config/paths';
import CpuLogger from './cpu';
import NetworkLogger from './network';
import TemperatureLogger from './temperature';
import ServerLogger from './server';
import DockerLogger from './docker';

const SystemLogger: any = {
  logFolder: paths.logFolder,
  cpuLogger: null as any,
  networkLogger: null as any,
  temperatureLogger: null as any,
  serverLogger: null as any,
  dockerLogger: null as any,

  initilize: function () {
    this.cpuLogger = new CpuLogger();
    this.networkLogger = new NetworkLogger();
    this.temperatureLogger = new TemperatureLogger();
    this.serverLogger = new ServerLogger();
    this.dockerLogger = new DockerLogger();
  },
  pruneLogFiles: function (service: string) {
    return new Promise((resolve, reject) => {
      const log_file_array = fs.readdirSync(this.logFolder).filter((file: any) => {
        if (file.indexOf(service) > -1) return file;
      });

      for (const file in log_file_array) {
        fs.unlink(path.join(this.logFolder, log_file_array[file]), (err) => {
          if (err) {
            reject(err);
          }
        });
      }

      this.initilize();

      setTimeout(() => {
        // Fake better user experience
        resolve(true);
      }, 2000);
    });
  },
  getLogger: function () {
    return this;
  }
};

export default SystemLogger;
