import React from 'react';
import { Grid, Header, Input } from 'semantic-ui-react';
import { useFlightControllerQuery, useUpdateFlightControllerMutation } from '../../../graphql/generated/dist';

const InternalAddress = () => {
  const { data: { flightController = {} } = {}, loading: fcLoading }: any = useFlightControllerQuery();
  const [storeData, { loading: storeDataLoading }] = useUpdateFlightControllerMutation();

  const inputHandler = (e: React.SyntheticEvent, data: any) => {
    storeData({ variables: { fc: { internalAddress: data.value } } });
  };

  const { internalAddress = '' } = flightController?.data || {};

  return (
    <Grid doubling padded columns={2}>
      <Grid.Column>
        <Header as='h4' content='FC Internal Address' subheader='Select which address is used for the FC connection' />
      </Grid.Column>
      <Grid.Column>
        <Input
          className={`icon border ${storeDataLoading ? 'border-danger' : 'border-success'}`}
          onChange={inputHandler}
          loading={fcLoading || storeDataLoading}
          // defaultValue={internalAddress}
          value={internalAddress}
          fluid
          placeholder='Internal Address'
          icon='pencil alternate'
          iconPosition='left'
        />
      </Grid.Column>
    </Grid>
  );
};

export default InternalAddress;
