import React from 'react';
import { useSubscription } from '@apollo/client';
import { Dropdown, Grid, Header } from 'semantic-ui-react';
import { GreenLed, RedLed } from '../../../components/led';
import { useModemDataQuery, useStoreModemValuesMutation, StatusDocument } from '../../../graphql/generated/dist';

const useVpn = [
  { key: 'false', text: 'Enabled', value: true },
  { key: 'true', text: 'Disabled', value: false }
];

const EnableModem = (): any => {
  const { data: { modemData = { message: '' } } = {}, loading: modemLoading }: any = useModemDataQuery();

  const [storeData, { loading: storeDataLoading }] = useStoreModemValuesMutation();
  const { data: { status = { errors: {} } } = {} } = useSubscription(StatusDocument);

  const dropdownHandler = (e: React.SyntheticEvent, data: any) => {
    storeData({ variables: { properties: { [data.name]: data.value } } });
  };

  if (modemLoading) return <div>Loading Data...</div>;

  const { enableModem } = modemData.message || {};
  return (
    <Grid doubling columns={2} verticalAlign='middle'>
      <Grid.Column width={8}>
        <Header as='h4' content='Virtual Private Network' subheader='This will enable Virtual Private Network' />
      </Grid.Column>
      <Grid.Column width={7}>
        <Dropdown
          button
          floating
          labeled
          name='enableVpn'
          className={`icon border ${storeDataLoading ? 'border-danger' : 'border-success'}`}
          loading={storeDataLoading}
          onChange={dropdownHandler}
          defaultValue={enableModem}
          options={useVpn}
          placeholder='Select a option!'
          icon={enableModem ? 'toggle on' : 'toggle off'}
        />
      </Grid.Column>
      <Grid.Column width={1}>{status.modem ? <GreenLed /> : <RedLed />}</Grid.Column>
    </Grid>
  );
};

export default EnableModem;
