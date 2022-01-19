import React from 'react';
import { Dropdown, Grid, Header } from 'semantic-ui-react';
import { useFlightControllerQuery, useUpdateFlightControllerMutation } from '../../../graphql/generated/dist';

const BaudRateOpt = [
  { key: '9600', value: '9600', text: '9600' },
  { key: '57600', value: '57600', text: '57600' },
  { key: '115200', value: '115200', text: '115200' },
  { key: 'custom', value: 'custom', text: 'Custom' }
];

const FcBaudRate = (props: any) => {
  const { data: { flightController = {} } = {}, loading: fcLoading }: any = useFlightControllerQuery();
  const [storeData, { loading: storeDataLoading }] = useUpdateFlightControllerMutation();

  const dropdownHandler = (e: React.SyntheticEvent, data: any) => {
    storeData({ variables: { fc: { baudRate: data.value } } });
  };

  const { baudRate } = flightController?.data || {};
  return (
    <Grid doubling padded columns={2}>
      <Grid.Column>
        <Header as='h4' content='Baudrate' subheader='Select the Baudrate you want to use. ' />
      </Grid.Column>
      <Grid.Column>
        <Dropdown
          loading={fcLoading || storeDataLoading}
          fluid
          button
          onChange={dropdownHandler}
          name='baudRate'
          className={`icon border ${storeDataLoading ? 'border-danger' : 'border-success'}`}
          floating
          labeled
          value={baudRate}
          icon={'paper plane outline'}
          options={BaudRateOpt}
          placeholder='Modem Interface'
        />
      </Grid.Column>
    </Grid>
  );
};

export default FcBaudRate;
