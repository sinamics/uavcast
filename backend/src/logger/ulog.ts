// import { path as rootPath } from 'app-root-path';
import path from 'path';
import moment from 'moment';
import fs from 'fs';
import { getLoggerRepository } from '../entity/Logger';
import { paths } from '../config/paths';

let logObj: {
  modemSignalStrength: '0';
  altitude: '0';
  satellites_visible: '0';
};
const logRoot = path.join(paths.logFolder, '/ulog');

const Ulog = {
  activeLogging: false,
  logParameters: {} as any,
  activeFileName: '',
  logFolder: logRoot,
  logData: {} as any,
  interval: null as any,
  constructor: async function () {
    this.logParameters = { resolution: 1.0, ...(await getLoggerRepository().findOne(1)) };
  },
  setArmed: function (arm: boolean) {
    if (arm && this.activeLogging !== arm) {
      this.activeFileName = this.newLogFile();
      //Start loginterval
      if (this.interval) clearInterval(this.interval);
      this.interval = setInterval(() => {
        this.appendData();
      }, 1000 / this.logParameters.resolution); // convert Hz to ms
    }
    if (!arm) {
      //Stop Loginterval
      this.activeFileName = '';
      clearInterval(this.interval);
    }

    this.activeLogging = arm;
  },
  setActiveLogger: function (param: any) {
    this.logParameters = { ...this.logParameters, ...param };
  },
  newLogFile: function () {
    // const time = moment().format('YYYY/MMDDHH-mm-ss');
    const time = moment().format('dddd, MMMM Do YYYY, h:mm:ss a');
    const filename = path.join(time + '.ulog');
    fs.mkdir(this.logFolder, { recursive: true }, (err) => {
      if (err) throw err;
    });

    return filename;
  },
  mergeData: function (data: object) {
    this.logData = { ...logObj, ...this.logData, ...data, datetime: new Date().getTime() };
  },
  appendData: function () {
    if (!this.activeLogging || !this.activeFileName) return;
    try {
      if (fs.existsSync(path.join(this.logFolder, this.activeFileName))) {
        const read_data: any = this.readFile(this.activeFileName);
        if (read_data === false) {
          // console.log('Logger appendData', 'not able to read file');
        }
        try {
          let getActiveLogParameters = {};
          for (const param in this.logParameters) {
            if (param in this.logData && this.logParameters[param]) {
              getActiveLogParameters = {
                ...getActiveLogParameters,
                [param]: this.logData[param]
              };
            }
            Object.assign(getActiveLogParameters, { datetime: this.logData.datetime });
          }
          read_data.push(getActiveLogParameters);
        } catch (error) {
          // console.log('Logger appendData', error);
        }
        const dataWrittenStatus = this.writeFile(this.activeFileName, read_data);
        if (dataWrittenStatus === false) {
          return; // console.log('Logger data adding failed');
        }
      }
      if (!fs.existsSync(path.join(this.logFolder, this.activeFileName))) {
        const dataWrittenStatus = this.writeFile(this.activeFileName, [this.logData]);
        if (dataWrittenStatus === false) {
          return; // console.log('Logger data adding failed first time');
        }
      }
      return true;
    } catch (err) {
      return false;
    }
  },
  getAllFilenamesInLogfolder: function () {
    const files: string[] = [];
    fs.readdirSync(this.logFolder).forEach((file) => {
      files.push(file);
    });
    return files;
  },
  readFile: function (filename: string) {
    try {
      const data = fs.readFileSync(path.join(this.logFolder, filename), 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      // console.error(err);
      return false;
    }
  },
  writeFile: function (filename: string, writedata: any) {
    try {
      fs.writeFileSync(path.join(this.logFolder, filename), JSON.stringify(writedata, null, 4));
      return true;
    } catch (err) {
      return false;
    }
  },
  deleteFile: function (filename: string) {
    try {
      fs.unlinkSync(path.join(this.logFolder, filename));
      return true;
    } catch (err) {
      return false;
    }
  },
  deleteAllFiles: function () {
    return new Promise((resolve, reject) => {
      fs.readdir(this.logFolder, (err, files) => {
        if (err) return reject(err);

        for (const file of files) {
          fs.unlink(path.join(this.logFolder, file), (err) => {
            if (err) reject(err);
          });
        }
      });
      setTimeout(() => {
        // Fake better user experience
        resolve(true);
      }, 2000);
    });
  }
};
export default Ulog;
