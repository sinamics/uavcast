import path from 'path';
import fs from 'fs';
import appRoot from 'app-root-path';
import moment from 'moment';
import microtime from 'microtime';
// import winston from './winstonconfig';
// import Log from '../../logger/winstonLogger';

import process from 'process';

class flightLogger {
  logFolder: any;
  tlogfolder: any;
  binlogfolder: any;
  activeFileTlog: any;
  activeFileBinlog: any;
  binLogSeq: number;
  binLogLastTime: number;
  activeLogging: boolean;
  settings: any;
  activeFileBinLog: any;

  constructor(settings: any) {
    this.logFolder = path.join(appRoot.toString(), '..', 'log'); // appRoot.toString() => backend/
    this.tlogfolder = path.join(this.logFolder, 'tlogs');
    this.binlogfolder = path.join(this.logFolder, 'binlogs');
    this.activeFileTlog = null;
    this.activeFileBinlog = null;
    this.binLogSeq = -1;
    this.binLogLastTime = 0;
    this.activeLogging = true;
    this.settings = settings;

    // get settings
    this.activeLogging = false;

    // Disable logging on nodejs < 12
    if (parseInt(process.versions.node, 10) < 12) {
      this.activeLogging = false;
    }
    // console.log(this.logFolder);
    // mkdir the log folders (both of them)
    fs.mkdirSync(this.tlogfolder, { recursive: true });
    // fs.mkdirSync(this.binlogfolder, { recursive: true });
  }

  // Start a new tlog
  newtlog() {
    if (parseInt(process.versions.node, 10) < 12) {
      return;
    }
    const filename = moment().format('YYYYMMDD-HHmmss'); // new Date().toISOString();
    this.activeFileTlog = path.join(this.tlogfolder, filename + '.tlog');
  }

  // Start a new binlog
  newbinlog() {
    if (parseInt(process.versions.node, 10) < 12) {
      return;
    }
    // already logging
    if (this.activeFileBinlog) {
      // console.log('Error: Binlog already active');
      return;
    }

    this.binLogSeq = -1;
    this.binLogLastTime = 0;

    const filename = moment().format('YYYYMMDD-HHmmss'); // new Date().toISOString();
    this.activeFileBinlog = path.join(this.binlogfolder, filename + '.bin');
    // console.log('New Binlog: ' + this.activeFileBinlog);
    // winston.info('New Binlog: ' + this.activeFileBinlog);
  }

  // stop logging (Tlog)
  stoptlog() {
    if (this.activeFileTlog) {
      // console.log('Closed Tlog: ' + this.activeFileTlog);
      //   winston.info('Closed Tlog: ' + this.activeFileTlog);
      this.activeFileTlog = null;
    }
  }

  // stop logging (Binlog)
  stopbinlog() {
    if (this.activeFileBinlog) {
      // console.log('Closed Binlog: ' + this.activeFileBinlog);
      //   winston.info('Closed Binlog: ' + this.activeFileBinlog);
      this.activeFileBinlog = null;
      this.binLogSeq = -1;
      this.binLogLastTime = 0;
    }
  }

  // Delete all logs - tlog or binlog
  clearlogs(logtype: any, curBinLog: any) {
    if (logtype === 'tlog') {
      const files = fs.readdirSync(this.tlogfolder);
      files.forEach((file: any) => {
        const filePath = path.join(this.tlogfolder, file);
        // don't remove the actively logging file
        if (!(this.activeFileTlog === filePath && this.activeLogging)) {
          fs.unlinkSync(filePath);
        }
      });
      // console.log('Deleted tlogs');
      //   winston.info('Deleted tlogs');
    } else if (logtype === 'binlog') {
      const files = fs.readdirSync(this.binlogfolder);
      files.forEach((file: any) => {
        const filePath = path.join(this.binlogfolder, file);
        // don't remove the actively logging file
        if (curBinLog !== filePath) {
          fs.unlinkSync(filePath);
        }
      });
      // console.log('Deleted binlogs');
      //   winston.info('Deleted binlogs');
    }
  }

  // write data to active log(s)
  // takes in a mavlink message
  // needs to be synchonous to ensure logfile isn't opened in parallel
  writetlog(msg: any) {
    if (!this.activeLogging) {
      return false;
    }
    if (!this.activeFileTlog) {
      this.newtlog();
    }
    try {
      // note this section does not work on nodejs < 12

      // Note we're using BigInt here, as a standard 32-bit Int
      // is too small to hold a microsecond timestamp
      const microSeconds = BigInt(microtime.now());
      const timebits = Buffer.alloc(8); // 8 bytes = 64 bits = BigInt

      // use this instead of jspack.Pack('>Q', [microSeconds]);
      timebits.writeBigInt64BE(microSeconds);

      const toWrite = Buffer.concat([timebits, msg._msgbuf]);
      fs.appendFileSync(this.activeFileTlog, toWrite, 'binary');
      return true;
    } catch (err) {
      // console.log('writetlog', err);
      return false;
    }
  }

  // write data to active bin log
  // takes in a mavlink message of
  // needs to be synchonous to ensure logfile isn't opened in parallel
  writeBinlog(msg: any) {
    if (this.binLogLastTime + 1000 < Date.now() && this.binLogLastTime !== 0) {
      // close log - no new packets in a while (1 sec)
      this.stopbinlog();
      return false;
    }
    if (!this.activeLogging || msg.name !== 'REMOTE_LOG_DATA_BLOCK') {
      return false;
    }
    if (msg.seqno === 0) {
      // start a new log
      this.newbinlog();
    }
    if (this.activeFileBinlog === null) {
      return false;
    }
    try {
      if (this.binLogSeq + 1 !== msg.seqno) {
        // console.log('Binlog OOT: seq=' + msg.seqno + ', exp=' + (this.binLogSeq + 1));
      }
      this.binLogSeq = Math.max(msg.seqno, this.binLogSeq);
      this.binLogLastTime = Date.now();

      fs.open(this.activeFileBinlog, 'a', function(err: any, file: any) {
        if (err) throw err;
        fs.write(file, msg.data, msg.seqno * 200, function(err: any) {
          if (err) {
            // console.log('Write error: ' + err);
          }
          fs.closeSync(file);
        });
      });
      // fs.appendFileSync(this.activeFileBinlog, msg.data, 'binary')
      return true;
    } catch (err) {
      // console.log('writeBinlog', err);
      return false;
    }
  }

  // enable or disable logging by sending true or false
  setLogging(logstat: any) {
    if (parseInt(process.versions.node, 10) < 12) {
      this.activeLogging = false;
    } else {
      this.activeLogging = logstat;
    }

    // and save
    this.settings.setValue('flightLogger.activeLogging', this.activeLogging);

    // console.log('Saved Logging settings: ' + this.activeLogging);
    // winston.info('Saved Logging settings: ' + this.activeLogging);

    return this.activeLogging;
  }

  // get system status
  getStatus() {
    if (parseInt(process.versions.node, 10) < 12) {
      return 'Cannot do logging on nodejs version <12';
    }
    if (this.activeFileBinlog && this.activeFileTlog && this.activeLogging) {
      return 'Logging to ' + path.basename(this.activeFileTlog) + ' and ' + path.basename(this.activeFileBinlog);
    } else if (!this.activeFileBinLog && this.activeFileTlog && this.activeLogging) {
      return 'Logging to ' + path.basename(this.activeFileTlog);
    } else if (!this.activeFileTlog && this.activeLogging) {
      return 'Logging Enabled, no packets from ArduPilot';
    } else {
      return 'Not Logging';
    }
  }

  // find all files in dir
  findInDir(dir: any, fileList: any = []) {
    const files = fs.readdirSync(dir);

    files.forEach((file: any) => {
      const filePath = path.join(dir, file);
      const fileStat = fs.lstatSync(filePath);
      const filemTime = new Date(fileStat.mtimeMs);

      if (fileStat.isDirectory()) {
        this.findInDir(filePath, fileList);
      } else {
        const relpath = path.relative(this.logFolder, filePath);
        const mTime = moment(filemTime).format('LLL');
        fileList.push({ key: relpath, name: path.basename(filePath), modified: mTime, size: Math.round(fileStat.size / 1024) });
      }
    });

    return fileList;
  }

  // get list of logfiles for website
  // return format is (err, tlogs)
  getLogs(callback: any) {
    const newfilestlog = this.findInDir(this.tlogfolder);
    const newfilesbinlog = this.findInDir(this.binlogfolder);
    return callback(false, newfilestlog, newfilesbinlog, this.activeLogging);
  }
}

export default flightLogger;
