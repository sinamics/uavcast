import { Grid, Header } from 'semantic-ui-react';
import Slider from '../../../components/slider';
import { useCameraDataQuery, useUpdateCameraMutation } from '../../../graphql/generated/dist';

const FramesPrSecond = () => {
  const { data: { cameraData = {} } = {}, loading: camLoading }: any = useCameraDataQuery();
  const [storeData] = useUpdateCameraMutation();

  const storeValue = (value: any) => {
    storeData({ variables: { properties: { framesPrSecond: value } } });
  };
  const { framesPrSecond } = cameraData?.database || {};

  if (camLoading) return <div />;
  return (
    <Grid style={{ paddingTop: '20px' }} doubling padded columns={2}>
      <Grid.Column>
        <Header as='h4' content='Frames Pr Second' subheader='Chose a value between 1 and 30' />
      </Grid.Column>
      <Grid.Column>
        <Slider step={1} defaultValue={framesPrSecond} max={30} min={2} onAfterChange={storeValue} />
      </Grid.Column>
    </Grid>
  );
};

export default FramesPrSecond;
