import { Card } from 'semantic-ui-react';
import { RedLed, GreenLed } from '../../../components/led';

const CastStatus = ({ status = {} }: any) => (
  <Card className='theme'>
    <Card.Content>
      <Card.Header className='themeText'>Casting Status</Card.Header>
      <Card.Description>
        Telemetry
        {status?.mavproxy ? <GreenLed /> : <RedLed />}
      </Card.Description>
      <Card.Description>
        Video
        {status?.video ? <GreenLed /> : <RedLed />}
      </Card.Description>
      <Card.Description>
        VPN
        {status?.vpn ? <GreenLed /> : <RedLed />}
      </Card.Description>
      <Card.Description>
        Autostart
        {status?.uavcast_systemd_enabled ? <GreenLed /> : <RedLed />}
      </Card.Description>
    </Card.Content>
  </Card>
);
export default CastStatus;
