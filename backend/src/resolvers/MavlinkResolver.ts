import { Root, Resolver, Subscription, Mutation, Args } from 'type-graphql';
import { MavAckResponse, MavlinkResponse } from '../graphql-response-types/MavlinkResponse';
import UdpClient from '../mavlink/v2.0/udp_client';
import MavConnection from '../mavlink';
import { MavlinkCommandInput } from '../graphql-input-types/MavlinkInput';

new UdpClient(); // eslint-disable-line no-new

const MavCon = new MavConnection({
  dialect: 'common',
  mavCockpitDisable: false
});

// command_long
// param_set
// param_request_list
// request_data_stream
@Resolver()
export class MavlinkResolver {
  @Mutation(() => Boolean)
  async sendMavCommand(@Args() { type, value }: MavlinkCommandInput) {
    switch (type) {
      case 'HEARTBEAT':
        MavCon.cmd.heartbeat(value);
        break;
      case 'COMMAND_LONG':
        MavCon.cmd.command_long(value);
        break;
      case 'REQUEST_DATA_STREAM':
        MavCon.cmd.request_data_stream(value);
        break;
      case 'PARAM_REQUEST_LIST':
        MavCon.cmd.param_request_list(value);
        break;
      case 'PARAM_SET':
        MavCon.cmd.param_request_list(value);
        break;
      case 'PREFLIGHT_CALIBRATION':
        MavCon.cmd.preFlightCalibration(value);
        break;
      case 'FS_LONG_ACTN':
      case 'FS_SHORT_ACTN':
      case 'FS_GCS_ENABL':
        MavCon.cmd.setGCSfailsafe(type, value);
        break;
      default:
        break;
    }
    return true;
  }

  //Application status
  @Subscription(() => MavlinkResponse, {
    // topics: "APPLICATION_STATUS", // single topic
    subscribe: (_, __, context) => {
      MavCon.PubSub = context.pubsub;
      MavCon.startHandshake();

      return context.pubsub.asyncIterator('MAVLINK_DATA');
    }
    // topics: ({ args, payload, context }) => args.topic // or dynamic topic function
    // filter: ():any => {
    //     console.log('object')
    // }
  })
  async mavlink(@Root() _mav: any): Promise<any> {
    return _mav;
  }

  @Subscription(() => MavAckResponse, {
    subscribe: (_, __, context) => {
      return context.pubsub.asyncIterator('MAVLINK_ACK');
    }
  })
  async cmdAck(@Root() _mav: any): Promise<any> {
    return _mav;
  }
}
