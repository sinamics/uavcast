import React from 'react';
import { Dropdown, Grid, Header } from 'semantic-ui-react';
import { useFlightControllerQuery, useUpdateFlightControllerMutation } from '../../../graphql/generated/dist';

const connectionOpt = [
  { key: 'gpio', value: 'gpio', text: 'GPIO TX / RX pins' },
  { key: 'usb', value: 'usb', text: 'USB' }
];

const FcConnectionType = () => {
  const { data: { flightController = {} } = {}, loading: fcLoading }: any = useFlightControllerQuery();
  const [storeData, { loading: storeDataLoading }] = useUpdateFlightControllerMutation();

  const dropdownHandler = (e: React.SyntheticEvent, data: any) => {
    storeData({
      variables: { fc: { connectionType: data.value, internalAddress: data.value === 'usb' ? '/dev/ttyACM0' : '/dev/ttyAMA0' } }
    });
  };

  const { connectionType } = flightController?.data || {};

  return (
    <Grid doubling padded columns={2}>
      <Grid.Column>
        <Header as='h4' content='Connection Type' subheader='Select the connection you use' />
      </Grid.Column>
      <Grid.Column>
        <Dropdown
          loading={fcLoading}
          fluid
          button
          onChange={dropdownHandler}
          name='connectionType'
          className={`icon border ${storeDataLoading ? 'border-danger' : 'border-success'}`}
          floating
          labeled
          value={connectionType}
          icon={'paper plane outline'}
          options={connectionOpt}
          placeholder='Connection Type'
        />
      </Grid.Column>
    </Grid>
  );
};

export default FcConnectionType;
