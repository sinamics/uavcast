import { Grid, Header } from 'semantic-ui-react';
import Slider from '../../../components/slider';
import { useCameraDataQuery, useUpdateCameraMutation } from '../../../graphql/generated/dist';

const CameraRotation = () => {
  const { data: { cameraData = {} } = {}, loading: camLoading }: any = useCameraDataQuery();
  const [storeData] = useUpdateCameraMutation();

  const storeValue = (value: any) => {
    storeData({ variables: { properties: { rotation: value } } });
  };
  const { rotation } = cameraData?.database || {};

  if (camLoading) return <div />;
  return (
    <Grid style={{ paddingTop: '5px' }} doubling padded columns={2}>
      <Grid.Column>
        <Header as='h4' content='Image Rotation' subheader='Chose a value' />
      </Grid.Column>
      <Grid.Column>
        <div>
          <Slider step={90} defaultValue={rotation} max={270} min={0} onAfterChange={storeValue} />
        </div>
      </Grid.Column>
    </Grid>
  );
};

export default CameraRotation;
