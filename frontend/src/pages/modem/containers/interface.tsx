import React from 'react';
import { Dropdown, Grid, Header } from 'semantic-ui-react';
import { useModemDataQuery, useStoreModemValuesMutation, useNicQuery } from '../../../graphql/generated/dist';

const ModemInterface = (props: any) => {
  const {
    data: { modemData = { message: '' } } = {},
    loading: modemLoading,
    refetch: reloadModemData
  }: any = useModemDataQuery();

  const [storeData, { loading: storeDataLoading }] = useStoreModemValuesMutation();
  const { data: { nic: { interfaces = [] } = {} } = {}, refetch: reloadNic }: any = useNicQuery();

  const dropdownHandler = (e: React.SyntheticEvent, data: any) => {
    storeData({ variables: { properties: { [data.name]: data.value } }, context: { fetchOptions: {} } }).then(() =>
      reloadModemData()
    );
  };

  if (modemLoading) return <div>Loading Data...</div>;

  const { modemInterface } = modemData.message || {};

  return (
    <Grid doubling padded columns={2}>
      <Grid.Column>
        <Header as='h4' content='Modem Interface' subheader='Select the network inteface attahced to the modem' />
      </Grid.Column>
      <Grid.Column>
        <Dropdown
          loading={storeDataLoading}
          fluid
          button
          onChange={dropdownHandler}
          name='modemInterface'
          className={`icon border ${storeDataLoading ? 'border-danger' : 'border-success'}`}
          floating
          labeled
          defaultValue={modemInterface}
          onOpen={() => reloadNic()}
          icon={'paper plane outline'}
          options={interfaces.map((v: any) => ({ text: v, value: v }))}
          placeholder='Modem Interface'
        />
      </Grid.Column>
    </Grid>
  );
};

export default ModemInterface;
