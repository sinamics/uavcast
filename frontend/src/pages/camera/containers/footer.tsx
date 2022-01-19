import { Button, Grid, Icon } from 'semantic-ui-react';
import { useKernelMessageMutation, useResetCameraDatabaseMutation } from '../../../graphql/generated/dist';

const CameraFooter = () => {
  const [kernelCommand] = useKernelMessageMutation();
  const [clearData] = useResetCameraDatabaseMutation();

  return (
    <Grid padded>
      <Grid.Column computer='14'>
        <Button.Group size='mini'>
          <Button
            onClick={() =>
              kernelCommand({
                variables: {
                  path: '/',
                  // eslint-disable-next-line max-len
                  cmd: 'sudo systemctl restart uavcast-camera && sleep 1s && journalctl -u uavcast-camera.service | tail'
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
            negative
            onClick={() =>
              kernelCommand({
                variables: {
                  path: '/',
                  // eslint-disable-next-line max-len
                  cmd: 'sudo systemctl stop uavcast-camera && sleep 1s && journalctl -u uavcast-camera.service | tail'
                }
              })
            }
          >
            <Icon name='close' />
            Stop camera
          </Button>
          {/* <Button.Or /> */}
          <Button
            onClick={() =>
              kernelCommand({
                variables: { cmd: 'sudo systemctl status uavcast-camera', path: '/' }
              })
            }
          >
            Status
          </Button>
          <Button
            onClick={() =>
              kernelCommand({
                variables: { cmd: 'sudo journalctl -u uavcast-camera', path: '/' }
              })
            }
          >
            View History Log
          </Button>
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
