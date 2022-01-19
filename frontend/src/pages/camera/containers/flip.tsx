import React from 'react';
import { Dropdown, Grid, Header } from 'semantic-ui-react';
import { useCameraDataQuery, useUpdateCameraMutation } from '../../../graphql/generated/dist';

const flipOptions = [
  { key: 'none', value: 'none', text: 'Default None' },
  { key: 'vertical-flip', value: 'vertical-flip', text: 'Vertical Flip' },
  { key: 'horizontal-flip', value: 'horizontal-flip', text: 'Horizontal Flip' },
  { key: 'rotate-180', value: 'rotate-180', text: 'Rotate-180' },
  { key: 'upper-left-diagonal', value: 'upper-left-diagonal', text: 'Flip across upper left/lower right diagonal' },
  { key: 'upper-right-diagonal', value: 'upper-right-diagonal', text: 'Flip across upper right/lower left diagonal' }
];

const CameraFlip = () => {
  const { data: { cameraData = {} } = {}, loading: camLoading }: any = useCameraDataQuery();
  const [storeData, { loading: storeDataLoading }] = useUpdateCameraMutation();

  const dropdownHandler = (e: React.SyntheticEvent, data: any) => {
    storeData({ variables: { properties: { flipCamera: data.value } } });
  };

  const { flipCamera } = cameraData?.database || {};

  return (
    <Grid doubling padded columns={2}>
      <Grid.Column>
        <Header as='h4' content='Flip Image' subheader='' />
      </Grid.Column>
      <Grid.Column>
        <Dropdown
          loading={camLoading || storeDataLoading}
          fluid
          button
          onChange={dropdownHandler}
          name='cameraType'
          className={`icon border ${storeDataLoading ? 'border-danger' : 'border-success'}`}
          floating
          labeled
          value={flipCamera}
          icon={'paper plane outline'}
          options={flipOptions}
          placeholder='Flip Image'
        />
      </Grid.Column>
    </Grid>
  );
};

export default CameraFlip;
