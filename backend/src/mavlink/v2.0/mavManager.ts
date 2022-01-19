// Mavlink Manager
import events from 'events';
import { frame } from './definitions/frame';
import { firmware } from './definitions/firmware';
import MavlinkCommands from './mavCommand/mav';
import Processor from './processor';
import pubsub from '../../utils/pubsub';

// const readMongodb = require('../../mongodb/read');

// const eventlog = require('../../mongodb/event-log');
// const Event = new eventlog();

class mavManager {
  version: any;
  dialect: any;
  MavVersion = 0;
  mavCockpitDisable: any;
  eventEmitter: any;
  FCprocessor: any;
  mavCmd: any;
  statusFWName: number;
  timeofLastPacket: number;
  conInternal: undefined;
  statusText: string;
  targetSystem: any;
  targetComponent: null;
  initialState: any;
  statusNumHeartbeats: number;
  intervalObj: any;
  messageObject: any;
  timeOutObject: any;

  constructor(dialect: string, mavCockpitDisable: boolean) {
    this.dialect = dialect;
    this.mavCockpitDisable = mavCockpitDisable;

    this.FCprocessor = new Processor(this.dialect, 2);
    // Create event emitter so we can pass messages arround
    this.eventEmitter = new events.EventEmitter();
    //@ts-ignore
    this.mavCmd = new MavlinkCommands(this.FCprocessor, this.eventEmitter);

    // this.mavLog = new mavLog('05.06.2020.tlog');
    // this.mavLog.playFile();
    // System status
    this.timeofLastPacket = 0;
    this.conInternal = undefined;
    this.statusText = '';

    // the vehicle
    this.targetSystem = null;
    this.targetComponent = null;

    this.initialState = {
      gps_raw_int: {},
      power_status: {},
      sys_status: {},
      vfr_hud: {},
      altitude: {},
      heartbeat: { numOfGcs: [], connected: false, armed: false, firmware: '', frame: '' },
      mission_waypoints: [],
      failsafe: {
        gcs: {},
        short: {},
        long: {}
      }
    };
    this.statusNumHeartbeats = 0;

    this.setUpdateInterval(1000);

    // Interval fir checking heartbeats
    this.intervalObj = null;
    this.messageObject = JSON.parse(JSON.stringify(this.initialState));

    // Get user saved updateinterval from mongoDb
    // readMongodb.loadDocumentID('uavnav', (db) => {
    //   if (!db) return this.setUpdateInterval(1000);

    //   this.setUpdateInterval(db.mav_update_hz);
    // });

    // Check if user has enabled event log in UI settings page
    // Event.fetchSettings((event) => {
    //   if (!event) return;
    //   if (event.enable) {
    //     this.setEventLogInterval(1000);
    //   }
    // });

    // UI data push interval
    this.timeOutObject = false;
    // Event log interval
    // this.EventLogtimeOut = false;

    // !Detect errors
    // this.FCprocessor.mav.on('error', function (e: any) {
    //   console.log(e);
    // });

    // what to do when we get a message
    // ?Serial data get parsed from flightController.js when establishing serial connection.
    // ?Mavlink will emit "messages" when new valid msg is recived.
    // ?Listen for new message

    // We disbale the rest if mavlink has been disabled.
    if (this.mavCockpitDisable) return this;

    // Else we load all mavlink params for the map.
    //
    // this.msgListener();
    // this.failsafeListner();
  }

  set MavlinkVersion(version: number) {
    if (this.MavVersion !== version) {
      this.MavVersion = version;
      // Create mav processor for Flight controller.
      this.FCprocessor = new Processor(this.dialect, version);
      this.heartBeat();
      this.msgListener();
      this.failsafeListner();
    }
  }
  get MavlinkVersion() {
    return this.MavVersion;
  }

  clearMissions() {
    this.messageObject.mission_waypoints = [];
  }

  // setEventLogInterval(interval) {
  //   if (this.EventLogtimeOut) clearInterval(this.EventLogtimeOut);
  //   this.EventLogtimeOut = setInterval(() => {
  //     Event.addLog({ name: 'mavlink', data: this.messageObject });
  //   }, 1000);
  // }
  setUpdateInterval(interval: number) {
    if (this.timeOutObject) clearInterval(this.timeOutObject);
    this.timeOutObject = setInterval(() => {
      this.eventEmitter.emit('ui_data', JSON.stringify(this.messageObject));
    }, interval);
  }

  // ?Return commands back to index.js
  getCommands() {
    return this.mavCmd;
  }

  parseBuffer(data: any) {
    // this.mavLog.startLogging(data);

    // incoming data
    // let t = this.FCprocessor.mav.decode(data);
    // console.log(t);
    this.FCprocessor.mav.parseBuffer(data);
  }

  conStatusStr() {
    // connection status - connected, not connected, no packets for x sec
    if (Date.now().valueOf() - this.timeofLastPacket < 2000) {
      return 'Connected';
    } else if (this.timeofLastPacket > 0) {
      return 'Connection lost for ' + (Date.now().valueOf() - this.timeofLastPacket) / 1000 + ' seconds';
    } else {
      return 'Not connected';
    }
  }

  conStatusInt() {
    // connection status - connected (1), not connected (0), no packets for x sec (-1)
    if (Date.now().valueOf() - this.timeofLastPacket < 2000) {
      // Connected
      return true;
      // callback(true);
    } else if (this.timeofLastPacket > 0) {
      return false;
      // callback(false);
    } else {
      return false;
      // callback(false);
    }
  }
  public getArmedStatus() {
    if (this.messageObject.heartbeat.armed) {
      return true;
    }

    return false;
  }
  heartBeat() {
    this.FCprocessor.mav.on('message', (msg: any) => {
      // console.log(msg.name);
      if (msg.name === 'HEARTBEAT' && msg.type !== 6) {
        // console.log(msg.autopilot);
        // console.log(msg.type);
      }
    });
    if (!this.FCprocessor && !this.FCprocessor.mav) return;

    this.FCprocessor.mav.on('HEARTBEAT', (msg: any) => {
      // Only get data from FC and not all the other GCS apps.
      if (msg.header.srcSystem !== 1) return;

      // console.log(msg);
      this.statusNumHeartbeats++;
      this.messageObject.heartbeat.connected = this.conStatusInt();
      this.messageObject.heartbeat.armed = msg.base_mode & this.FCprocessor.mavmsg.MAV_MODE_FLAG_SAFETY_ARMED;
      this.messageObject.heartbeat.firmware = firmware[msg.autopilot];
      this.messageObject.heartbeat.frame = frame[msg.type];

      // count number of connected GCS
      if (this.messageObject.heartbeat.numOfGcs.indexOf(msg.type) === -1 && msg.type > 4 && msg.name === 'HEARTBEAT') {
        this.messageObject.heartbeat.numOfGcs.push(msg.type);
      }

      if (this.targetSystem === null) {
        this.targetSystem = msg.header.srcSystem;
        this.targetComponent = msg.header.srcComponent;
        this.mavCmd.setHeader(msg.header);
      }

      for (let index = 0; index < msg.fieldnames.length; index++) {
        this.messageObject.heartbeat[msg.fieldnames[index]] = msg[msg.fieldnames[index]];
      }

      // winston.logger.info('mavlink', { mavlink: JSON.stringify(this.messageObject.heartbeat) });
      // Get last heartbeat

      this.timeofLastPacket = Date.now().valueOf();
    });
  }
  msgListener() {
    this.FCprocessor.mav.on('VFR_HUD', (msg: { [x: string]: any; fieldnames: string | any[] }) => {
      // console.log(this.FCprocessor.mav.decode(msg));

      for (let index = 0; index < msg.fieldnames.length; index++) {
        this.messageObject.vfr_hud[msg.fieldnames[index]] = msg[msg.fieldnames[index]];
      }
    });

    this.FCprocessor.mav.on('POWER_STATUS', (msg: { [x: string]: any; fieldnames: string | any[] }) => {
      for (let index = 0; index < msg.fieldnames.length; index++) {
        this.messageObject.power_status[msg.fieldnames[index]] = msg[msg.fieldnames[index]];
      }
    });

    this.FCprocessor.mav.on('GPS_RAW_INT', (msg: { [x: string]: any; fieldnames: string | any[] }) => {
      for (let index = 0; index < msg.fieldnames.length; index++) {
        this.messageObject.gps_raw_int[msg.fieldnames[index]] = msg[msg.fieldnames[index]];
      }
    });

    this.FCprocessor.mav.on('MISSION_ITEM_INT', (msg: { [x: string]: any; fieldnames: any }) => {
      const wayp = [];
      for (let index = 0; index < msg.fieldnames.length; index++) {
        wayp[msg.fieldnames[index]] = msg[msg.fieldnames[index]];
      }
      this.messageObject.mission_waypoints.push(wayp);
    });
    // COMMAND_ACK only applies for command_long commands.
    // Will output command and result. See list of result enum bellow link
    // https://mavlink.io/en/messages/common.html#MAV_RESULT
    this.FCprocessor.mav.on('COMMAND_ACK', (msg: { [x: string]: any; fieldnames: any }) => {
      for (let index = 0; index < msg.fieldnames.length; index++) {
        pubsub?.publish('MAVLINK_ACK', { [msg.fieldnames[index]]: msg[msg.fieldnames[index]] });
      }
    });

    this.FCprocessor.mav.on('MISSION_COUNT', (msg: { count: number }) => {
      const n_waypoints = msg.count;
      if (!n_waypoints) return;

      this.messageObject.mission_waypoints = [];

      for (let index = 0; index < msg.count; index++) {
        // This command will let FC fire off MISSION_ITEM_INT with each waypoint information.
        this.mavCmd.getMissionsByID(index);
      }
    });

    this.FCprocessor.mav.on('SYS_STATUS', (msg: { [x: string]: any; fieldnames: string | any[] }) => {
      for (let index = 0; index < msg.fieldnames.length; index++) {
        this.messageObject.sys_status[msg.fieldnames[index]] = msg[msg.fieldnames[index]];
      }
    });

    // !PX4 messages
    this.FCprocessor.mav.on('BATTERY_STATUS', (msg: { [x: string]: any; fieldnames: string | any[] }) => {
      for (let index = 0; index < msg.fieldnames.length; index++) {
        this.messageObject.power_status[msg.fieldnames[index]] = msg[msg.fieldnames[index]];
      }
    });
    this.FCprocessor.mav.on('ALTITUDE', (msg: { [x: string]: any; fieldnames: string | any[] }) => {
      for (let index = 0; index < msg.fieldnames.length; index++) {
        this.messageObject.altitude[msg.fieldnames[index]] = msg[msg.fieldnames[index]];
      }
    });
  }
  failsafeListner() {
    // Get failsafe value
    this.FCprocessor.mav.on('PARAM_VALUE', (msg: { [x: string]: any; param_id: string; fieldnames: string | any[] }) => {
      if (!msg.param_id) return;

      if (msg.param_id.localeCompare('FS_GCS_ENABL') === 0) {
        for (let index = 0; index < msg.fieldnames.length; index++) {
          this.messageObject.failsafe.gcs[msg.fieldnames[index]] = msg[msg.fieldnames[index]];
        }
      }
      if (msg.param_id.localeCompare('FS_SHORT_ACTN') === 0) {
        for (let index = 0; index < msg.fieldnames.length; index++) {
          this.messageObject.failsafe.short[msg.fieldnames[index]] = msg[msg.fieldnames[index]];
        }
      }
      if (msg.param_id.localeCompare('FS_LONG_ACTN') === 0) {
        for (let index = 0; index < msg.fieldnames.length; index++) {
          this.messageObject.failsafe.long[msg.fieldnames[index]] = msg[msg.fieldnames[index]];
        }
      }
    });
  }
  startHeartbeatInterval() {
    this.mavCmd.paramRequestList();
    // start the 1-sec loop checking for disconnects
    if (this.intervalObj) clearInterval(this.intervalObj);
    this.intervalObj = setInterval(() => {
      if (this.mavCmd && (this.statusNumHeartbeats === 0 || !this.conStatusInt())) {
        this.mavCmd.sendDSRequest();

        // waiting for initial connection
        this.messageObject = JSON.parse(JSON.stringify(this.initialState));
      }
    }, 1000);
  }
}

export default mavManager;
// module.exports = mavManager;
