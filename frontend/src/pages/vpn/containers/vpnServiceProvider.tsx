import React from 'react';
import { Dropdown, Grid, Header } from 'semantic-ui-react';
import { useVpnDataQuery, useStoreVpnValuesMutation } from '../../../graphql/generated/dist';

const vpnList = [
  { key: 'zerotier', text: 'Zerotier', value: 'zerotier' },
  { key: 'openvpn', text: 'Openvpn', value: 'openvpn' },
  { key: 'disabled', text: 'Disabled', value: 'disabled' }
];

const VpnServiceProvider = (props: any) => {
  const { data: { vpnData = { data: '' } } = {}, loading: modemLoading, refetch: reloadModemData }: any = useVpnDataQuery();

  const [storeData, { loading: storeDataLoading }] = useStoreVpnValuesMutation();

  const dropdownHandler = (e: React.SyntheticEvent, data: any) => {
    storeData({
      variables: { properties: { serviceProvider: data.value, enableVpn: data.value !== 'disabled' } },
      context: { fetchOptions: {} }
    }).then(() => reloadModemData());
  };

  if (modemLoading) return <div>Loading Data...</div>;

  const { serviceProvider } = vpnData.data || {};

  return (
    <Grid doubling padded columns={2}>
      <Grid.Column>
        <Header as='h4' content='Vpn type' subheader='Choose the vpn type' />
      </Grid.Column>
      <Grid.Column>
        <Dropdown
          loading={storeDataLoading}
          onChange={dropdownHandler}
          options={vpnList}
          placeholder='VPN Type'
          defaultValue={serviceProvider}
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

export default VpnServiceProvider;
