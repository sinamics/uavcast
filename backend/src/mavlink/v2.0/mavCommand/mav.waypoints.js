module.exports = function (MAV) {
  MAV.prototype.getMissionsByID = function (id) {
    if (!this.targetSystem) return console.log('No targetsystem found!'); // eslint-disable-line no-console
    // Request All params from the Flight Controller
    const msg = new this.FCprocessor.mavmsg.messages.mission_request_int(this.targetSystem, this.targetComponent, id);
    this.sendDataToUI(msg);
  };
  MAV.prototype.getMissionCount = function () {
    if (!this.targetSystem) return console.log('No targetsystem found!'); // eslint-disable-line no-console
    // Request All params from the Flight Controller
    const msg = new this.FCprocessor.mavmsg.messages.mission_request_list(this.targetSystem, this.targetComponent);
    this.sendDataToUI(msg);
  };
};
