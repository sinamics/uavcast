import { Grid, Header } from 'semantic-ui-react';
import Slider from '../../../components/slider';
import { useCameraDataQuery, useUpdateCameraMutation } from '../../../graphql/generated/dist';

const BitratePrSecond = () => {
  const { data: { cameraData = {} } = {}, loading: camLoading }: any = useCameraDataQuery();
  const [storeData] = useUpdateCameraMutation();

  const storeValue = (value: any) => {
    storeData({ variables: { properties: { bitratePrSecond: value } } });
  };
  const { bitratePrSecond } = cameraData?.database || {};

  if (camLoading) return <div />;

  return (
    <Grid style={{ paddingTop: '5px' }} doubling padded columns={2}>
      <Grid.Column>
        <Header as='h4' content='Bitrate Pr Second' subheader='Chose a value between 1 and 30' />
      </Grid.Column>
      <Grid.Column>
        <div>
          <Slider step={1000000} defaultValue={bitratePrSecond} max={25000000} min={1000000} onAfterChange={storeValue} />
        </div>
      </Grid.Column>
    </Grid>
  );
};

export default BitratePrSecond;
