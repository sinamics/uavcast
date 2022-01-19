import React from 'react';
import { Grid, Header, Input } from 'semantic-ui-react';
import { useFlightControllerQuery, useUpdateFlightControllerMutation } from '../../../graphql/generated/dist';

const TcpPort = () => {
  const { data: { flightController = {} } = {}, loading: fcLoading }: any = useFlightControllerQuery();
  const [storeData, { loading: storeDataLoading }] = useUpdateFlightControllerMutation();

  const inputHandler = (e: React.SyntheticEvent, data: any) => {
    storeData({ variables: { fc: { tcpPort: data.value } } });
  };

  const { tcpPort } = flightController?.data || {};
  return (
    <Grid doubling padded columns={2}>
      <Grid.Column>
        <Header as='h4' content='TCP Port' subheader='TCP will allways be enabled using this defined port' />
      </Grid.Column>
      <Grid.Column>
        <Input
          className={`icon border ${storeDataLoading ? 'border-danger' : 'border-success'}`}
          onChange={inputHandler}
          loading={fcLoading || storeDataLoading}
          value={tcpPort || 5790}
          fluid
          placeholder='TCP port...'
          iconPosition='left'
          icon='pencil alternate'
        />
      </Grid.Column>
    </Grid>
  );
};

export default TcpPort;
