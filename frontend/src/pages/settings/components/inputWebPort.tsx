import React, { useState, useEffect } from 'react';
import { Button, Grid, Header, Input, Label } from 'semantic-ui-react';
import { useGetApplicationQuery, useKernelMessageMutation, useUpdateApplicationMutation } from '../../../graphql/generated/dist';

const WebPortInput = () => {
  const [port, setPort] = useState(Number);
  const [portLoading, setPortLoadingt] = useState(Boolean);

  const { data: { getApplication = {} } = {}, loading }: any = useGetApplicationQuery({
    fetchPolicy: 'network-only'
  });
  const [kernel] = useKernelMessageMutation();

  const [storeData, { error: updateError }] = useUpdateApplicationMutation({
    errorPolicy: 'all'
  });

  const { properties = {} } = getApplication;

  useEffect(() => {
    if (!properties?.webPort) return;

    setPort(properties?.webPort);
  }, [properties]);

  const onchangeHandler = (e: any) => {
    setPort(parseInt(e.target.value, 10));
  };
  const restartServer = (e: any) => {
    setPortLoadingt(true);
    storeData({ variables: { properties: { webPort: port } } }).then(() =>
      kernel({
        variables: { cmd: 'nohup /app/uavcast/bin/build/./uav_main -p && docker restart uavcast &', path: '/app/uavcast/bin' }
      }).then(() => {
        const host = window.location.hostname;
        const newHost = `${host}:${port}`;

        setTimeout(() => {
          window.location.href = `http://${newHost}`;
        }, 1000);
      })
    );
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <Grid.Column computer={8} mobile={8}>
        <Header content='Server Port' subheader='Change the default web port.' />
      </Grid.Column>
      <Grid.Column computer={4} mobile={4}>
        <Input
          loading={loading}
          className={` ${updateError && 'border border-danger'}`}
          icon={'paper plane outline'}
          placeholder='port'
          value={port}
          onChange={onchangeHandler}
        />
        {updateError && (
          <div>
            <Label size='mini' color='red'>
              {updateError && updateError.message}
            </Label>
          </div>
        )}
      </Grid.Column>
      <Grid.Column computer={4} mobile={4}>
        {properties?.webPort !== port && (
          <Button loading={portLoading} onClick={restartServer} size='small' color='orange'>
            Restart Server
          </Button>
        )}
      </Grid.Column>
    </>
  );
};

export default WebPortInput;
