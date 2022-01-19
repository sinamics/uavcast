import React from 'react';
import { Dropdown, Grid, Header } from 'semantic-ui-react';
import { useModemDataQuery, useStoreModemValuesMutation } from '../../../graphql/generated/dist';
import { YesNo } from '../components/dropdown-arrays';

const ModemInformation = (props: any) => {
  const {
    data: { modemData = { message: '' } } = {},
    loading: modemLoading,
    refetch: reloadModemData
  }: any = useModemDataQuery();

  const [storeData, { loading: storeDataLoading }] = useStoreModemValuesMutation();

  const dropdownHandler = (e: React.SyntheticEvent, data: any) => {
    storeData({ variables: { properties: { [data.name]: data.value } }, context: { fetchOptions: {} } }).then(() =>
      reloadModemData()
    );
  };

  if (modemLoading) return <div>Loading Data...</div>;

  const { modemInformation } = modemData.message || {};
  // console.log(modemData);
  return (
    <Grid doubling padded columns={2}>
      <Grid.Column>
        <Header
          as='h4'
          content='Modem Information'
          subheader='Get modem statistics such as cell network, signal strength. This will only work for Huawei HiLink modems'
        />
      </Grid.Column>
      <Grid.Column>
        <Dropdown
          disabled
          loading={storeDataLoading}
          defaultValue={modemInformation}
          options={YesNo}
          onChange={dropdownHandler}
          name='modemInformation'
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

export default ModemInformation;
