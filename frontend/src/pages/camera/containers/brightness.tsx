import { Grid, Header } from 'semantic-ui-react';
import Slider from '../../../components/slider';
import { useCameraDataQuery, useUpdateCameraMutation } from '../../../graphql/generated/dist';

const CameraBrightness = () => {
  const { data: { cameraData = {} } = {}, loading: camLoading }: any = useCameraDataQuery();
  const [storeData] = useUpdateCameraMutation();

  const storeValue = (value: any) => {
    storeData({ variables: { properties: { brightness: value } } });
  };
  const { brightness } = cameraData?.database || {};

  if (camLoading) return <div />;
  return (
    <Grid style={{ paddingTop: '5px' }} doubling padded columns={2}>
      <Grid.Column>
        <Header as='h4' content='Image Brightness' subheader='Choose a value' />
      </Grid.Column>
      <Grid.Column>
        <div>
          <Slider step={0.1} defaultValue={brightness} max={1} min={-1} onAfterChange={storeValue} />
        </div>
      </Grid.Column>
    </Grid>
  );
};

export default CameraBrightness;
