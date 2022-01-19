import React from 'react';
import { useSubscription } from '@apollo/client';
import { Dropdown, Grid, Header } from 'semantic-ui-react';
import { GreenLed, RedLed } from '../../../components/led';
import { StatusDocument, useCameraDataQuery, useUpdateCameraMutation } from '../../../graphql/generated/dist';

const enableOptions = [
  { key: 'enable', text: 'Enabled', value: true },
  { key: 'disabled', text: 'Disabled', value: false }
];
const EnableCam = () => {
  const { data: { cameraData = {} } = {}, loading: camLoading }: any = useCameraDataQuery();
  const [storeData, { loading: storeDataLoading }] = useUpdateCameraMutation();
  const { data: { status = { errors: {} } } = {} } = useSubscription(StatusDocument);

  const dropdownHandler = (e: React.SyntheticEvent, data: any) => {
    storeData({ variables: { properties: { enableCamera: data.value } } });
  };

  const { enableCamera } = cameraData?.database || {};

  return (
    <Grid doubling columns={2} verticalAlign='middle'>
      <Grid.Column width={8}>
        <Header as='h4' content='Camera' subheader='gstreamer configuration' />
      </Grid.Column>
      <Grid.Column width={7}>
        <Dropdown
          loading={camLoading || storeDataLoading}
          button
          onChange={dropdownHandler}
          name='cameraType'
          className={`icon border ${storeDataLoading ? 'border-danger' : 'border-success'}`}
          floating
          labeled
          value={enableCamera}
          icon={enableCamera ? 'toggle on' : 'toggle off'}
          options={enableOptions}
          placeholder='Enable Camera'
        />
      </Grid.Column>
      <Grid.Column width={1}>{status.video ? <GreenLed /> : <RedLed />}</Grid.Column>
    </Grid>
  );
};

export default EnableCam;
