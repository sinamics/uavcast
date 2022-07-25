import React, { useState } from 'react';
import { Button, Grid, Header, Icon, Input } from 'semantic-ui-react';
import { useChildProcessCmdMutation } from '../../../graphql/generated/dist';

const ZerotierId = () => {
  const [networkId, setNetworkId] = useState<string>('');
  const [kernelCommand] = useChildProcessCmdMutation();

  const inputHandler = (e: React.SyntheticEvent, data: any) => {
    setNetworkId(data.value);
  };

  return (
    <>
      <Grid stackable padded columns={2}>
        <Grid.Column>
          <Header as='h4' content='Zerotier Network ID' subheader='Set the Network ID provided by zerotier network' />
        </Grid.Column>
        <Grid.Column>
          <Grid columns={2}>
            <Grid.Column width={10}>
              <Input onChange={inputHandler} value={networkId} fluid placeholder='Zerotier network ID' />
            </Grid.Column>
            <Grid.Column width={6}>
              <Button
                disabled={!networkId}
                fluid
                onClick={() =>
                  kernelCommand({
                    variables: { cmd: 'sudo zerotier-cli join ' + networkId, path: '/' }
                  }).then(() => setNetworkId(''))
                }
                positive
              >
                <Icon name='lock' />
                Connect
              </Button>
            </Grid.Column>
          </Grid>
        </Grid.Column>
      </Grid>
    </>
  );
};

export default ZerotierId;
