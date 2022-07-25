/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSubscription } from '@apollo/client';
import { Card, Container, Form, Grid, Header } from 'semantic-ui-react';
import RaspberryConsole from '../../components/CodeMirror';
import { StatusDocument, StdoutDocument, useVpnDataQuery } from '../../graphql/generated/dist';
import ZerotierId from './containers/zerotierId';
import VpnServiceProvider from './containers/vpnServiceProvider';
import OpenVpnFooter from './containers/openvpn.footer';
import ZerotierFooter from './containers/zerotier.footer';
import VpnHelp from './components/help';
import ZerotierTable from './containers/zerotierTable';
import OpenVpn from './containers/openvpn.input';
import { GreenLed, RedLed } from '../../components/led';

const VpnController = (): any => {
  const { data: { status } = {} } = useSubscription(StatusDocument);
  const { data: { stdout = { message: '', errors: {} } } = {} } = useSubscription(StdoutDocument);
  const { data: { vpnData = { data: '' } } = {}, loading: modemLoading }: any = useVpnDataQuery();

  if (modemLoading) return <div>Loading Data...</div>;

  const { serviceProvider } = vpnData.data || {};

  return (
    <Form>
      <Container fluid>
        <Grid stackable padded columns={2}>
          <Grid.Column computer={13} mobile={16}>
            <Card fluid color='green' className='theme'>
              {/* Header, enable modem */}
              <Card.Content className='cardHeader'>
                <Grid centered columns={2}>
                  <Grid.Column width={5}>
                    <Header as='h4' content='Virtual Private Network' subheader='This will enable Virtual Private Network' />
                  </Grid.Column>
                  <Grid.Column floated='right' verticalAlign='middle' width={1}>
                    {status?.vpn ? <GreenLed /> : <RedLed />}
                  </Grid.Column>
                </Grid>
              </Card.Content>
              <Card.Content>
                {/* <Card.Content> */}
                {/* Divider */}
                {/* <Divider horizontal>Settings</Divider> */}

                {/* Slect Modem Type  */}
                <VpnServiceProvider />

                {/* Stick options  */}
                {serviceProvider === 'zerotier' && <ZerotierId />}
                {serviceProvider === 'zerotier' && <ZerotierTable />}
                {serviceProvider === 'openvpn' && <OpenVpn />}

                {/* Footer  */}
                <Grid padded columns={1}>
                  <Grid.Column>
                    {serviceProvider === 'zerotier' && <ZerotierFooter />}
                    {serviceProvider === 'openvpn' && <OpenVpnFooter />}
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
            <VpnHelp />
          </Grid.Column>
        </Grid>
      </Container>
    </Form>
  );
};

export default VpnController;
