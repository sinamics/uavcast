import React from 'react';
import { Dropdown, Grid, Header } from 'semantic-ui-react';
import { useCameraDataQuery, useUpdateCameraMutation } from '../../../graphql/generated/dist';
import { extractHostname } from '../../../utils/apolloClient';

export const protocolArr = [
  { key: 'rtsp', value: 'rtsp', text: 'RTSP' },
  { key: 'udp', value: 'udp', text: 'UDP' },
  { key: 'tcp', value: 'tcp', text: 'TCP', disabled: true }
];

const CameraProtocol = () => {
  const { data: { cameraData = {} } = {}, loading: protoLoading }: any = useCameraDataQuery();
  const [storeData, { loading: storeDataLoading }] = useUpdateCameraMutation();

  const dropdownHandler = (e: React.SyntheticEvent, data: any) => {
    storeData({ variables: { properties: { protocol: data.value } } });
  };

  const { protocol } = cameraData?.database || {};
  const url = extractHostname(window.location.href);
  return (
    <Grid doubling padded columns={2}>
      <Grid.Column>
        <Header as='h4' content='Camera Protocol' subheader='Select the protocol you want to use' />
      </Grid.Column>
      <Grid.Column>
        <Dropdown
          loading={protoLoading || storeDataLoading}
          fluid
          button
          onChange={dropdownHandler}
          name='cameraType'
          className={`icon border ${storeDataLoading ? 'border-danger' : 'border-success'}`}
          floating
          labeled
          value={protocol}
          icon={'paper plane outline'}
          options={protocolArr}
          placeholder='Camera Protocol'
        />
        <span className='themeText'>
          access video stream by using <span style={{ color: 'yellow' }}>rtsp://{url}:8554/uavcast</span>
        </span>
        {/* <Label basic>Default selectOnNavigation</Label> */}
      </Grid.Column>
    </Grid>
  );
};

export default CameraProtocol;
