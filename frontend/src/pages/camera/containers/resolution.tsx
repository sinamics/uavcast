import { Dropdown, Grid, Header } from 'semantic-ui-react';
import { useCameraDataQuery, useUpdateCameraMutation } from '../../../graphql/generated/dist';

const CameraResolution = () => {
  const { data: { cameraData = {} } = {}, loading: protoLoading }: any = useCameraDataQuery();
  const [storeData, { loading: storeDataLoading }] = useUpdateCameraMutation();

  const dropdownHandler = (e: any, data: any) => {
    storeData({ variables: { properties: { resolution: data.value, format: e.currentTarget.getAttribute('format') } } });
  };

  const { availableCams = [] } = cameraData;
  const { resolution, cameraType } = cameraData?.database || {};

  const resOpt = availableCams?.find((c: any) => c.device === cameraType) || [];

  return (
    <Grid doubling padded columns={2}>
      <Grid.Column>
        <Header as='h4' content='Camera Resolution' subheader='Select the resolution you want to use' />
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
          disabled={!resOpt?.caps}
          value={resolution}
          icon={'paper plane outline'}
          options={resOpt?.caps}
          placeholder='Camera Resolution'
        />
      </Grid.Column>
    </Grid>
  );
};

export default CameraResolution;

// gst-launch-1.0 v4l2src device=raspivid ! video/x-raw,width=1920,height=1080 !
// videoflip video-direction=identity ! videoconvert ! video/x-raw,format=I420 !
// videobalance contrast=1 brightness=0 ! queue max-size-buffers=1 name=q_enc !
// x264enc tune=zerolatency bitrate=2000 speed-preset=superfast ! rtph264pay name=pay0 pt=96 !
// multiudpsink clients=10.0.0.27:5600
