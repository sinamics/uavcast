import si from 'systeminformation';
import winston from 'winston';
import { paths } from '../config/paths';
import 'winston-daily-rotate-file';

let interval: any = null;

class CpuLogger {
  name: string;
  logger: winston.Logger;
  constructor() {
    this.name = 'cpu';
    this.fetchData();
    this.logger = this.createLogger();
  }

  fetchData() {
    if (interval) clearInterval(interval);
    interval = setInterval(() => {
      si.currentLoad().then((data) => this.logger.info(JSON.stringify(data.currentLoad)));
    }, 5000);
  }
  createTransport() {
    return new winston.transports.DailyRotateFile({
      filename: `${paths.logFolder}/cpu-stats-%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
      // zippedArchive: true,
      json: true,
      maxSize: '5m',
      maxFiles: '7d',
      auditFile: `${paths.logFolder}/cpu-stats-audit.json`,
      format: winston.format.combine(winston.format.json())
    });
  }
  createLogger() {
    if (winston.loggers.has(this.name)) {
      winston.loggers.close(this.name);
    }
    return winston.loggers.add(this.name, {
      transports: [this.createTransport()],
      format: winston.format.combine(
        //   errorFilter(),
        //   winston.format.colorize(),
        winston.format.timestamp(),
        // winston.format.label({ label: 'Server' }),
        // winston.format.printf((info: any) => `${info.timestamp}  [${info.label}]: ${{ hey: info.message }}`),
        winston.format.json()
      )
    });
  }
  addConsole() {
    if (process.env.NODE_ENV !== 'production') {
      this.logger.add(
        new winston.transports.Console({
          level: 'server',
          format: winston.format.combine(
            winston.format.timestamp({
              format: 'YYYY-MM-DD HH:mm:ss'
            }),
            winston.format.printf((info: any) => `${info.level}: ${info.message}`)
          ),
          //@ts-ignore
          prettyPrint: (object: any): any => {
            return JSON.stringify(object);
          }
        })
      );
    }
  }
  queryLogs({ from, until }: any) {
    return new Promise((resolve, reject): any => {
      const options: any = {
        from,
        until,
        limit: Infinity, // last 60 minutes
        start: 0,
        order: 'asc',
        fields: ['timestamp', 'message']
      };
      this.logger.query(options, function (err: any, result: any) {
        if (err) {
          reject(err);
          // throw callback(err);
        }
        // console.log(JSON.stringify(result));
        resolve(result);
      });
    });
  }
}

export default CpuLogger;
