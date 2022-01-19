import React from 'react';
import { Dropdown, Grid, Header } from 'semantic-ui-react';
import { useCameraDataQuery, useUpdateCameraMutation } from '../../../graphql/generated/dist';
import CustomCommands from './customCommand';

const CameraType = () => {
  const { data: { cameraData = {} } = {}, loading: camLoading, refetch }: any = useCameraDataQuery();
  const [storeData, { loading: storeDataLoading }] = useUpdateCameraMutation();

  const dropdownHandler = (e: React.SyntheticEvent, data: any) => {
    storeData({ variables: { properties: { cameraType: data.value } } });
  };

  const { cameraType } = cameraData?.database || {};
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
          value={cameraType}
          icon={'paper plane outline'}
          options={cameraData?.availableCams}
          placeholder='Camera Type'
        />
        {/* Select custom pipeline */}

        {cameraType === 'custom' && <CustomCommands />}
      </Grid.Column>
    </Grid>
  );
};

export default CameraType;
