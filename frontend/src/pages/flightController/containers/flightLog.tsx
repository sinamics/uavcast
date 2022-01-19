import React from 'react';
import { Checkbox, Grid, Header } from 'semantic-ui-react';
import { useFlightControllerQuery, useUpdateFlightControllerMutation } from '../../../graphql/generated/dist';

const FlightLog = () => {
  const { data: { flightController = {} } = {} }: any = useFlightControllerQuery();
  const [storeData] = useUpdateFlightControllerMutation();

  const inputHandler = (e: React.SyntheticEvent, data: any) => {
    storeData({ variables: { fc: { binFlightLog: data.checked } } });
  };

  const { binFlightLog } = flightController?.data || {};
  return (
    <Grid doubling padded columns={2}>
      <Grid.Column>
        <Header
          as='h4'
          content='Flight Stack Log'
          subheader='Generate .bin logfiles. Can be downloaded in Logviewer page. Stored in /var/log/flight-stack'
        />
      </Grid.Column>
      <Grid.Column>
        <Checkbox checked={binFlightLog} onChange={inputHandler} label={{ children: 'Tick to enable' }} />
        {/* <Input
          className={`icon border ${storeDataLoading ? 'border-danger' : 'border-success'}`}
          onChange={inputHandler}
          loading={fcLoading || storeDataLoading}
          defaultValue={tcpPort}
          fluid
          placeholder='TCP port...'
          iconPosition='left'
          icon='pencil alternate'
        /> */}
      </Grid.Column>
    </Grid>
  );
};

export default FlightLog;
