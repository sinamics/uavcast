import UdpClient from './v2.0/udp_client';
import MavManager from './v2.0/mavManager';
import AppLogger from '../logger/ulog';

class Mavlink extends UdpClient {
  manager: any;
  cmd: any;
  pubsub: any;
  constructor({ dialect, mavCockpitDisable }: any) {
    // call udp class
    super();

    // Get command class

    // the mavlink manager object
    this.manager = new MavManager(dialect, mavCockpitDisable);
    this.cmd = this.manager.getCommands();

    //Listen for new messages
    this.receiveFCmsg();

    //Push data to graphql subscription
    this.manager.eventEmitter.on('ui_data', (data: any) => {
      // console.log(JSON.parse(data));
      this.pubsub?.publish('MAVLINK_DATA', { message: JSON.parse(data) });
    });

    //send commands to flight controller from UI
    this.manager.eventEmitter.on('sendData', (buffer: ArrayBuffer | SharedArrayBuffer) => {
      if (!buffer) return; //console.log('No message found, command not sent!');

      this.sendFCcommand(buffer);
    });
  }
  sendFCcommand(buffer: any) {
    this.udpStream.send(Buffer.from(buffer), this.port, this.localhost, function (error) {
      if (error) {
        // console.log('UDP Error: ' + error);
      } else {
        // console.log('Data sent !!!');
      }
    });
  }
  receiveFCmsg() {
    // ?Receive UDP message from localhost.
    this.udpStream.on('message', (msg, info: any) => {
      this.port = parseInt(info.port, 10);
      this.localhost = info.address;

      // Autoselct Mavlink version.
      // check mavlink version from the first byte.  MAVLink 1: 0xFE, MAVLink 2: 0xFD
      // https://mavlink.io/en/guide/mavlink_version.html
      // 253 (0xFD) = mav 2.
      const mVers = msg.readUInt8(0) === 253 ? 2 : 1;
      if (this.manager.MavlinkVersion !== mVers) {
        this.manager.MavlinkVersion = mVers;
      }
      // Add data to logger
      AppLogger.setArmed(this.manager.getArmedStatus());
      if (process.env.NODE_ENV !== 'production') {
        AppLogger.mergeData({
          // Dev, simulation
          altitude: Math.floor(Math.random() * 100) + 40,
          satellites: this.manager.messageObject.gps_raw_int.satellites_visible
        });
      } else {
        AppLogger.mergeData({
          // Prodcution
          altitude: this.manager.messageObject.gps_raw_int.alt,
          satellites: this.manager.messageObject.gps_raw_int.satellites_visible
        });
      }

      this.manager && this.manager.parseBuffer(msg);
    });
  }
  startHandshake() {
    this.manager.startHeartbeatInterval();
    // this.manager.getCommands().sendDSRequest();
  }
  sendCommand() {
    this.manager;
  }
  set PubSub(pubsub: any) {
    this.pubsub = pubsub;
  }
}

export default Mavlink;
