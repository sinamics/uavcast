import React from 'react';
import { Dropdown, Grid, Header } from 'semantic-ui-react';
// import { GreenLed, RedLed } from '../../../components/led';
import { useModemDataQuery, useStoreModemValuesMutation } from '../../../graphql/generated/dist';

const useModem = [
  { key: 'false', text: 'Enabled', value: true },
  { key: 'true', text: 'Disabled', value: false }
];

const EnableModem = () => {
  const {
    data: { modemData = { message: '' } } = {},
    loading: modemLoading,
    refetch: reloadModemData
  }: any = useModemDataQuery();

  const [storeData, { loading: storeDataLoading }] = useStoreModemValuesMutation();
  // const { data: { status = { errors: {} } } = {} } = useSubscription(StatusDocument);

  const dropdownHandler = (e: React.SyntheticEvent, data: any) => {
    storeData({ variables: { properties: { [data.name]: data.value } }, context: { fetchOptions: {} } }).then(() =>
      reloadModemData()
    );
  };

  if (modemLoading) return <div>Loading Data...</div>;

  const { enableModem } = modemData.message || {};
  return (
    <Grid doubling padded columns={2}>
      <Grid.Column width={8}>
        <Header as='h4' content='Enable modem' subheader='This will enable modem integration' />
      </Grid.Column>
      <Grid.Column>
        <Dropdown
          button
          floating
          labeled
          fluid
          name='enableModem'
          className={`icon border ${storeDataLoading ? 'border-danger' : 'border-success'}`}
          loading={storeDataLoading}
          onChange={dropdownHandler}
          defaultValue={enableModem}
          options={useModem}
          placeholder='Select a option!'
          icon={'paper plane outline'}
        />
      </Grid.Column>
    </Grid>
  );
};

export default EnableModem;
