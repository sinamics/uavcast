import { useSubscription } from '@apollo/client';
import { Card, Container, Grid, Header } from 'semantic-ui-react';
import RaspberryConsole from '../../components/CodeMirror';
import { StatusDocument, StdoutDocument } from '../../graphql/generated/dist';
import SelectFlightController from './containers/flightController';
import ModemHelp from './aside/help';
import FcConnectionType from './containers/connectionType';
import FcBaudRate from './containers/baudRate';
import FcFooter from './containers/footer';
import MavlinkInspector from './containers/mavlinkInspector';
import TcpPort from './containers/tcpPort';
import InternalAddress from './containers/internalAddress';
import FlightLog from './containers/flightLog';
import { GreenLed, RedLed } from '../../components/led';

const FlightController = () => {
  const { data: { status } = {} } = useSubscription(StatusDocument);
  const { data: { stdout = { message: '', errors: {} } } = {} } = useSubscription(StdoutDocument);

  return (
    <Container fluid>
      <Grid stackable padded columns={2} divided>
        <Grid.Column computer={13} mobile={16}>
          <Card fluid className='theme'>
            <Card.Content className='cardHeader'>
              <Grid centered columns={2}>
                <Grid.Column width={5}>
                  <Header as='h4' content='Flight Controller' subheader='FC configuration' />
                </Grid.Column>
                <Grid.Column floated='right' verticalAlign='middle' width={1}>
                  {status?.mavproxy ? <GreenLed /> : <RedLed />}
                </Grid.Column>
              </Grid>
            </Card.Content>
            <Card.Content>
              {/* Slect FC Type  */}
              <SelectFlightController />

              {/* Slect connection usb/gpio type */}
              <FcConnectionType />

              {/* Select if modeminformation should be enabled  */}
              <FcBaudRate />

              {/* Select tcp port */}
              <TcpPort />

              {/* Select internal Address */}
              <InternalAddress />

              {/* Flight Stack Logging */}
              <FlightLog />

              {/* check if heartbeats received! */}
              <MavlinkInspector />

              {/* Footer  */}
              <FcFooter />

              <Grid padded columns={1}>
                <Grid.Column style={{ height: '300px' }}>
                  <RaspberryConsole stdout={stdout.message} error={stdout.errors} />
                </Grid.Column>
              </Grid>
            </Card.Content>
          </Card>
        </Grid.Column>

        <Grid.Column computer={3} only='computer'>
          <ModemHelp />
        </Grid.Column>
      </Grid>
    </Container>
  );
};

export default FlightController;
