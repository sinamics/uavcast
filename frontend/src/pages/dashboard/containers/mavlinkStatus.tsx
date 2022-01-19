import { useSubscription } from '@apollo/client';
import { Card } from 'semantic-ui-react';
import { GreenLed, RedLed } from '../../../components/led';
import { MavlinkDocument } from '../../../graphql/generated/dist';

const MavlinkStatus = () => {
  const { data: { mavlink = {} } = {} } = useSubscription(MavlinkDocument);

  const { heartbeat = {} } = mavlink.message || {};
  // console.log(heartbeat);
  return (
    <Card className='theme'>
      <Card.Content>
        <Card.Header className='themeText'>Mavlink Status</Card.Header>
        <Card.Description>
          Mavlink connected:
          {heartbeat?.connected ? <GreenLed /> : <RedLed />}
        </Card.Description>
        <Card.Description>
          Vehicle Armed:
          {heartbeat?.armed ? <GreenLed /> : <RedLed />}
        </Card.Description>
        <Card.Description>
          Firmware:
          <span className='float-right font-weight-bold'>{heartbeat?.firmware}</span>
        </Card.Description>
        <Card.Description>
          Frame: Frame:
          <span className='float-right font-weight-bold'>{heartbeat?.frame}</span>
        </Card.Description>
      </Card.Content>
    </Card>
  );
};

export default MavlinkStatus;
