import React from 'react';
import { Dropdown, Grid, Header } from 'semantic-ui-react';
import { useCameraDataQuery, useUpdateCameraMutation } from '../../../graphql/generated/dist';
import CustomPipeline from './customPipeline';
import CustomPath from './customPath';

const CameraSelect = () => {
  const { data: { cameraData = {} } = {}, loading: camLoading, refetch }: any = useCameraDataQuery();
  const [storeData, { loading: storeDataLoading }] = useUpdateCameraMutation();

  const dropdownHandler = (e: React.SyntheticEvent, data: any) => {
    const cam_obj = data?.options.filter((o: any) => o.value === data?.value)[0];
    storeData({ variables: { properties: { name: cam_obj.text, path: cam_obj.value, key: cam_obj.key } } });
  };

  const { path, key } = cameraData?.database || {};

  return (
    <Grid doubling padded columns={2}>
      <Grid.Column>
        <Header as='h4' content='Camera Type' subheader='Select the camera you want to use' />
      </Grid.Column>
      <Grid.Column>
        <Dropdown
          loading={camLoading || storeDataLoading}
          fluid
          button
          onOpen={() => refetch()}
          onChange={dropdownHandler}
          name='cameraType'
          className={`icon border ${storeDataLoading ? 'border-danger' : 'border-success'}`}
          floating
          labeled
          value={path}
          icon={'paper plane outline'}
          options={cameraData?.availableCams}
          placeholder='Camera Type'
        />
        {/*
            Select custom pipeline / path
        */}

        {key === 'custom_pipeline' && <CustomPipeline />}
        {key === 'custom_path' && <CustomPath />}
      </Grid.Column>
    </Grid>
  );
};

export default CameraSelect;
