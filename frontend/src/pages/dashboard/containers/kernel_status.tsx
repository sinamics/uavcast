import { Card } from 'semantic-ui-react';
import { RedLed, GreenLed } from '../../../components/led';

const KernelStatus = ({ status = {} }: any) => (
  <Card className='theme'>
    <Card.Content>
      <Card.Header className='themeText'>Kernel Status</Card.Header>
      <Card.Description>
        Temperature
        {status.undervoltage ? <RedLed /> : <GreenLed />}
      </Card.Description>
      <Card.Description>
        CPU throttling
        {status.undervoltage ? <RedLed /> : <GreenLed />}
      </Card.Description>
      <Card.Description>
        Power (undervoltage detection)
        {status.undervoltage ? <RedLed /> : <GreenLed />}
      </Card.Description>
    </Card.Content>
  </Card>
);
export default KernelStatus;
