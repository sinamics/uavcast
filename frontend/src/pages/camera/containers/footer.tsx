import { Button, Grid, Icon } from 'semantic-ui-react';
import {
  useCameraActionsMutation,
  // useKernelMessageMutation,
  useResetCameraDatabaseMutation
} from '../../../graphql/generated/dist';

const CameraFooter = ({ getDockerLogs }: any) => {
  // const [kernelCommand] = useKernelMessageMutation();
  const [clearData] = useResetCameraDatabaseMutation();
  const [cameraAction, { loading }] = useCameraActionsMutation({
    errorPolicy: 'all'
  });

  return (
    <Grid padded>
      <Grid.Column computer='14'>
        <Button.Group size='mini'>
          <Button
            loading={loading}
            onClick={() =>
              cameraAction({
                variables: {
                  properties: { playStream: true }
                }
              })
            }
            positive
            // icon
          >
            <Icon name='video' />
            Start camera
          </Button>
          <Button.Or />
          <Button
            loading={loading}
            negative
            onClick={() =>
              cameraAction({
                variables: {
                  properties: { playStream: false }
                }
              })
            }
          >
            <Icon name='close' />
            Stop camera
          </Button>
          {/* <Button.Or /> */}
          {/* <Button
            onClick={() =>
              kernelCommand({
                variables: { cmd: 'sudo systemctl status uavcast-camera', path: '/' }
              })
            }
          >
            Status
          </Button> */}
          <Button onClick={() => getDockerLogs()}>View History Log (last 5min)</Button>
        </Button.Group>
      </Grid.Column>
      <Grid.Column computer='2'>
        <Button.Group size='mini' fluid>
          <Button basic negative onClick={() => clearData()}>
            <Icon name='repeat' />
            Reset Values
          </Button>
        </Button.Group>
      </Grid.Column>
    </Grid>
  );
};

export default CameraFooter;
