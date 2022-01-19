import React from 'react';
import { Grid, Header, Input } from 'semantic-ui-react';
import { useModemDataQuery, useStoreModemValuesMutation } from '../../../graphql/generated/dist';

// import { useStoreModemValuesMutation } from '../../../graphql/generated/dist';

const StickOptions = (props: any) => {
  const {
    data: { modemData = { message: '' } } = {},
    loading: modemLoading,
    refetch: reloadModemData
  }: any = useModemDataQuery();

  const [storeData, { loading: storeDataLoading }] = useStoreModemValuesMutation();

  const inputHandler = (e: React.SyntheticEvent, data: any) => {
    storeData({ variables: { properties: { [data.name]: data.value } }, context: { fetchOptions: {} } }).then(() =>
      reloadModemData()
    );
  };
  const { pinCode, internalAddress, username, password } = modemData.message;
  return (
    <>
      <Grid padded columns={2}>
        <Grid.Column>
          <Header
            as='h4'
            content='Modem Internal Adress'
            subheader='Set the internal address of the USB modem if you know it, otherwise leave as default '
          />
        </Grid.Column>
        <Grid.Column>
          <Input
            loading={storeDataLoading || modemLoading}
            onChange={inputHandler}
            defaultValue={internalAddress}
            fluid
            name='internalAddress'
            placeholder='internalAddress'
          />
        </Grid.Column>

        <Grid.Column>
          <Header as='h4' content='Pin Number' type='number' subheader='Set the sim pin code' />
        </Grid.Column>
        <Grid.Column>
          <Input
            loading={storeDataLoading || modemLoading}
            onChange={inputHandler}
            defaultValue={pinCode}
            fluid
            name='pinCode'
            placeholder='Pin Code'
          />
        </Grid.Column>

        <Grid.Column>
          <Header as='h4' content='Credentials' subheader='Type the network dredentials' />
        </Grid.Column>
        <Grid.Column>
          <Grid columns={2}>
            <Grid.Column>
              <Input
                loading={storeDataLoading || modemLoading}
                onChange={inputHandler}
                defaultValue={username}
                name='username'
                fluid
                placeholder='username ...'
              />
            </Grid.Column>
            <Grid.Column>
              <Input
                loading={storeDataLoading || modemLoading}
                onChange={inputHandler}
                defaultValue={password}
                name='password'
                fluid
                placeholder='password ...'
              />
            </Grid.Column>
          </Grid>
        </Grid.Column>
      </Grid>
    </>
  );
};

export default StickOptions;
