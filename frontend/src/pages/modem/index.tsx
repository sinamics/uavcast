import { useSubscription } from '@apollo/client';
import { Card, Container, Form, Grid, Header } from 'semantic-ui-react';
import RaspberryConsole from '../../components/CodeMirror';
import { StdoutDocument, useModemDataQuery } from '../../graphql/generated/dist';
import StickOptions from './containers/stick.options';
import ModemType from './containers/type';
import ModemInformation from './containers/information';
import ModemInterface from './containers/interface';
import HiLinkFooter from './containers/hilink.footer';
import StickFooter from './containers/stick.footer';
import { CellSignals } from '../../components/cellSignals';
import EnableModem from './containers/enable.modem';
import ModemHelp from './components/help';

const ModemController = () => {
  const { data: { stdout = { message: '', errors: {} } } = {} } = useSubscription(StdoutDocument);
  const { data: { modemData = { message: '' } } = {}, loading: modemLoading }: any = useModemDataQuery();

  if (modemLoading) return <div>Loading Data...</div>;

  const { modemType, modemInformation } = modemData.message || {};
  return (
    <Form>
      <Container fluid>
        <Grid stackable padded columns={2} divided>
          <Grid.Column computer={13} mobile={16}>
            <Card fluid color='green' className='theme'>
              {/* Header, enable modem */}

              <Card.Content className='cardHeader'>
                <Grid.Column width={8}>
                  <Header as='h4' content='Modem' subheader='modem configuration' />
                </Grid.Column>
                {/* <Grid.Column width={1}>{status.modem ? <GreenLed /> : <RedLed />}</Grid.Column> */}
              </Card.Content>
              <Card.Content>
                {/* <Card.Content> */}
                {/* Divider */}
                {/* <Divider horizontal>Settings</Divider> */}

                {/* Enable Modem  */}
                <EnableModem />

                {/* Slect Modem Type  */}
                <ModemType />

                {/* Slect Modem interface  */}
                <ModemInterface />

                {/* Select if modeminformation should be enabled  */}
                <ModemInformation />

                {/* Stick options  */}
                {modemType === 'stick' && <StickOptions />}

                {/* Cell Signals  */}
                {modemInformation && <CellSignals modemStats={{ SignalStrength: 25 }} />}

                {/* Footer  */}
                <Grid padded columns={1}>
                  <Grid.Column>
                    {modemType === 'hilink' && <HiLinkFooter />}
                    {modemType === 'stick' && <StickFooter />}
                  </Grid.Column>
                </Grid>

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
    </Form>
  );
};

export default ModemController;
