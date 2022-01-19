// Mavlink Manager
function MAV(this: any, FCprocessor: any, event: any) {
  this.FCprocessor = FCprocessor;
  this.targetSystem = null;
  this.targetComponent = null;
  this.eventEmitter = event;
}
MAV.prototype.setHeader = function (header: { srcSystem: any; srcComponent: any }) {
  this.targetSystem = header.srcSystem;
  this.targetComponent = header.srcComponent;
};
MAV.prototype.sendDataToUI = function (msg: { pack: (arg0: any) => any }) {
  this.eventEmitter.emit('sendData', msg.pack(this.FCprocessor.mav));
};
MAV.prototype.sendReboot = function () {
  // create a reboot packet
  if (!this.targetSystem) return console.log('No targetsystem found!');
  var msg = new this.FCprocessor.mavmsg.messages.heartbeat(
    this.targetSystem,
    this.targetComponent,
    this.FCprocessor.mavmsg.MAV_CMD_PREFLIGHT_REBOOT_SHUTDOWN,
    0,
    1,
    0,
    0,
    0,
    0,
    0,
    0
  );
  this.sendDataToUI(msg);
};

MAV.prototype.sendDSRequest = function () {
  var msg = new this.FCprocessor.mavmsg.messages.request_data_stream(
    this.targetSystem,
    this.targetComponent,
    this.FCprocessor.mavmsg.MAV_DATA_STREAM_ALL,
    1,
    1
  );
  this.sendDataToUI(msg);
};

MAV.prototype.stopDSRequest = function () {
  // create a datastream request packet
  if (!this.targetSystem) return console.log('No targetsystem found!');
  // Request All params from the Flight Controller
  var msg = new this.FCprocessor.mavmsg.messages.request_data_stream(
    this.targetSystem,
    this.targetComponent,
    this.FCprocessor.mavmsg.MAV_DATA_STREAM_ALL,
    1, // Hz FC will send packages
    0 // 1 => Acive, 0 => Off
  );
  this.sendDataToUI(msg);
};
// Get failsafe data
// https://mavlink.io/en/messages/common.html#PARAM_REQUEST_LIST

// Seeing FS_GCS_ENABL to 1 means that GCS failsafe will be triggered when the aircraft has not received a MAVLink HEARTBEAT message.
// Setting FS_GCS_ENABL to 2 means that GCS failsafe will be triggered on either a loss of HEARTBEAT messages,
// or a RADIO_STATUS message from a MAVLink enabled 3DR radio indicating that the ground station is not receiving status updates from the aircraft,
// which is indicated by the RADIO_STATUS.remrssi field being zero (this may happen if you have a one way link due to asymmetric noise on the ground station and aircraft radios).
// Setting FS_GCS_ENABL to 3 means that GCS failsafe will be triggered by Heartbeat(like option one), but only in AUTO mode. WARNING: Enabling this option opens up the possibility of
// your plane going into failsafe mode and running the motor on the ground it it loses contact with your ground station.
// If this option is enabled on an electric plane then you should enable ARMING_REQUIRED.

MAV.prototype.paramRequestList = function () {
  var msg = new this.FCprocessor.mavmsg.messages.param_request_list(
    this.targetSystem,
    this.targetComponent,
    this.FCprocessor.mavmsg.PARAM_REQUEST_LIST,
    1,
    1
  );
  this.sendDataToUI(msg);
};
MAV.prototype.setGCSfailsafe = function (command: string, value: any) {
  // create a reboot packet
  if (!this.targetSystem) return console.log('No targetsystem found!');

  var msg = new this.FCprocessor.mavmsg.messages.param_set(
    this.targetSystem,
    this.targetComponent,
    command,
    value, // Value of the command
    1 // https://mavlink.io/en/messages/common.html#MAV_PARAM_TYPE
  );
  this.sendDataToUI(msg);
};
MAV.prototype.getGCSfailsafe = function () {
  // create a reboot packet
  if (!this.targetSystem) return console.log('No targetsystem found!');
  var msg = new this.FCprocessor.mavmsg.messages.param_request_read(
    this.targetSystem,
    this.targetComponent,
    'FS_GCS_ENABL',
    -1 // https://mavlink.io/en/messages/common.html#MAV_PARAM_TYPE
  );
  this.sendDataToUI(msg);
};
MAV.prototype.command_long = function (command_id: number) {
  // create a reboot packet
  if (!this.targetSystem) return console.log('No targetsystem found!');
  var msg = new this.FCprocessor.mavmsg.messages.command_long(
    this.targetSystem,
    this.targetComponent,
    command_id, // this.FCprocessor.mavmsg.MAV_CMD_NAV_RETURN_TO_LAUNCH,
    1, // Confirmation
    0,
    0,
    0, //ground pressure calibration
    0,
    0, //1: accelerometer calibration, 2: board level calibration, 3: accelerometer temperature calibration, 4: simple accelerometer calibration
    0, //1: APM: compass/motor interference calibration (PX4: airspeed calibration, deprecated), 2: airspeed calibration
    0
  );

  this.sendDataToUI(msg);
};

MAV.prototype.preFlightCalibration = function () {
  // this.FCprocessor.mav.on('COMMAND_ACK', (msg) => {
  //   callback({ result: mav_result[msg.result] });
  // });
  // create a reboot packet
  if (!this.targetSystem) return console.log('No targetsystem found!');
  var msg = new this.FCprocessor.mavmsg.messages.command_long(
    this.targetSystem,
    this.targetComponent,
    this.FCprocessor.mavmsg.MAV_CMD_PREFLIGHT_CALIBRATION,
    0, // Confirmation 1=on / 0=off
    0,
    0,
    1, //ground pressure calibration
    0,
    1, //1: accelerometer calibration, 2: board level calibration, 3: accelerometer temperature calibration, 4: simple accelerometer calibration
    2, //1: APM: compass/motor interference calibration (PX4: airspeed calibration, deprecated), 2: airspeed calibration
    0
  );

  this.sendDataToUI(msg);
};

export default MAV;
