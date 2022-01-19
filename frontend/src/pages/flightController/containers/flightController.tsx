import React from 'react';
import { Dropdown, Grid, Header } from 'semantic-ui-react';
import { useFlightControllerQuery, useUpdateFlightControllerMutation } from '../../../graphql/generated/dist';

const flightControllerOptions = [
  { key: 'apm', value: 'apm', text: 'ArduPilot - Mavlink' },
  { key: 'navio', value: 'navio', text: 'Navio', disabled: true }
];

const FligthControllerOptions = () => {
  const { data: { flightController = {} } = {}, loading: fcLoading }: any = useFlightControllerQuery();

  const [storeData, { loading: storeDataLoading, error: updateError }] = useUpdateFlightControllerMutation({
    errorPolicy: 'all'
  });

  const dropdownHandler = (e: React.SyntheticEvent, data: any) => {
    storeData({ variables: { fc: { controller: data.value } } });
  };

  const { controller } = flightController?.data || {};

  return (
    <Grid doubling padded columns={2}>
      <Grid.Column widescreen={16} textAlign='center'>
        {updateError && <label className='text-danger'>{updateError?.message}</label>}
      </Grid.Column>
      <Grid.Column>
        <Header as='h4' content='Controller' subheader='Select the connection method used' />
      </Grid.Column>
      <Grid.Column>
        <Dropdown
          loading={fcLoading || storeDataLoading}
          value={controller}
          options={flightControllerOptions}
          onChange={dropdownHandler}
          name='controller'
          fluid
          button
          className={`icon border ${storeDataLoading ? 'border-danger' : 'border-success'}`}
          floating
          labeled
          icon={'paper plane outline'}
          placeholder='Select a option!'
        />
      </Grid.Column>
    </Grid>
  );
};

export default FligthControllerOptions;
