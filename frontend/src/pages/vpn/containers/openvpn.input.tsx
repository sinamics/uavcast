import React from 'react';
import { Grid, Header, Input } from 'semantic-ui-react';
import { useStoreVpnValuesMutation, useVpnDataQuery } from '../../../graphql/generated/dist';
import Dropzone from '../containers/dropzone';

const OpenVpnInput = () => {
  const [storeData] = useStoreVpnValuesMutation();
  const { data: { vpnData = { data: '' } } = {} }: any = useVpnDataQuery();

  const inputHandler = (e: any) => {
    //@ts-ignore
    storeData({ variables: { properties: { [e.target.name]: e.target.value } } });
  };
  const { data } = vpnData;

  return (
    <Grid doubling padded columns={2}>
      <Grid.Column>
        <Header as='h4' content='Username' subheader='vpn account username' />
      </Grid.Column>
      <Grid.Column className='themeBg'>
        <Input className='themeBg' name='username' onChange={inputHandler} value={data.username} fluid placeholder='Username' />
      </Grid.Column>
      <Grid.Column>
        <Header as='h4' content='Password' subheader='vpn account password' />
      </Grid.Column>
      <Grid.Column>
        <Input name='password' onChange={inputHandler} value={data.password} fluid placeholder='Password' />
      </Grid.Column>

      <Grid.Column>
        <Header as='h4' content='Openvpn Config' subheader='ovpn file' />
      </Grid.Column>
      <Grid.Column className='themeText'>
        <Dropzone />
      </Grid.Column>
    </Grid>
  );
};

export default OpenVpnInput;
