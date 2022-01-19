import React from 'react';
import { Dropdown, Grid, Header } from 'semantic-ui-react';
import { useModemDataQuery, useStoreModemValuesMutation } from '../../../graphql/generated/dist';

const modemList = [
  { key: 'hilink', text: 'HiLink', value: 'hilink' },
  { key: 'stick', text: 'Stick', value: 'stick' }
];

const ModemType = (props: any) => {
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

  const { modemType } = modemData.message || {};

  return (
    <Grid doubling padded columns={2}>
      <Grid.Column>
        <Header as='h4' content='Modem type' subheader='Choose the modem type, hilink or stick mode' />
      </Grid.Column>
      <Grid.Column>
        <Dropdown
          loading={storeDataLoading}
          onChange={dropdownHandler}
          options={modemList}
          placeholder='Modem Type'
          defaultValue={modemType}
          name='modemType'
          fluid
          button
          className={`icon border ${storeDataLoading ? 'border-danger' : 'border-success'}`}
          floating
          labeled
          icon={'paper plane outline'}
        />
        {/* <Form.Field control={Select} options={modemList} placeholder='Gender' error /> */}
      </Grid.Column>
    </Grid>
  );
};

export default ModemType;
