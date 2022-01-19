const { mavlink10: mavlink10C, MAVLink10Processor: MAVLink10ProcessorC } = require('./dialects/mavlink_common_v1.js');
const { mavlink20: mavlink20C, MAVLink20Processor: MAVLink20ProcessorC } = require('./dialects/mavlink_common_v2.js');
const { mavlink10: mavlink10A, MAVLink10Processor: MAVLink10ProcessorA } = require('./dialects/mavlink_ardupilot_v1.js');
const { mavlink20: mavlink20A, MAVLink20Processor: MAVLink20ProcessorA } = require('./dialects/mavlink_ardupilot_v2.js');

class processor {
  constructor(dialect, version) {
    this.dialect = dialect;
    this.version = version;
    this.mav = null;
    this.mavmsg = null;

    // each udp output has a mavlink processor
    // this ensures non-fragmented mavlink packets from the clients
    switch (true) {
      case this.version === 1 && this.dialect === 'common':
        this.mav = new MAVLink10ProcessorC(null, 255, 0);
        this.mavmsg = mavlink10C;
        break;
      case this.version === 2 && this.dialect === 'common':
        this.mav = new MAVLink20ProcessorC(null, 255, 0);
        this.mavmsg = mavlink20C;
        break;
      case this.version === 1 && this.dialect === 'ardupilot':
        this.mav = new MAVLink10ProcessorA(null, 255, 0);
        this.mavmsg = mavlink10A;
        break;
      case this.version === 2 && this.dialect === 'ardupilot':
        this.mav = new MAVLink20ProcessorA(null, 255, 0);
        this.mavmsg = mavlink20A;
        break;
      default:
        console.log('Error - no valid MAVLink version or dialect');
        break;
    }
  }
}

// export default processor;
module.exports = processor;
