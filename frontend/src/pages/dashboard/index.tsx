import React from 'react';
import CastStatus from './containers/casting_status';
import KernelStatus from './containers/kernel_status';
import { Card, Container, Divider, Grid } from 'semantic-ui-react';
import TemperatureChart from './components/temperatureChart';
import { StatusDocument } from '../../graphql/generated/dist';
import { useSubscription } from '@apollo/client';
import NetworkChart from './components/networkLogChart';
import CpuChart from './components/cpuLogChart';
import SimulateStartup from './containers/simulate_startup';
import MavlinkStatus from './containers/mavlinkStatus';

const Dashboard = () => {
  // const { t, i18n } = useTranslation() ;
  const { data: { status } = {} } = useSubscription(StatusDocument);

  return (
    <Container fluid>
      <Grid padded columns={1}>
        <Grid.Row>
          <Grid.Column>
            <Card.Group>
              {/* Cast status cards */}
              <CastStatus status={status} />

              {/* Kernel status cards */}
              <KernelStatus status={status} />

              <MavlinkStatus />
            </Card.Group>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Grid padded>
        <Grid.Row columns={1}>
          <Grid.Column>
            <SimulateStartup />
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Divider horizontal>OS Statistic</Divider>
      <Grid divided columns={3} stackable>
        <Grid.Column>
          <TemperatureChart />
        </Grid.Column>
        <Grid.Column>
          <NetworkChart />
        </Grid.Column>
        <Grid.Column>
          <CpuChart />
        </Grid.Column>
      </Grid>
      {/* <Divider horizontal>Network</Divider> */}
    </Container>
  );
};

// const hasStarted = (value) => {
//   return value === true ? <GreenLed /> : <RedLed />;
// };

export default Dashboard;
