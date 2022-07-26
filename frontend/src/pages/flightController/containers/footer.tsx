import { Button, Grid, Icon } from 'semantic-ui-react';
import { useChildProcessCmdMutation, useResetFlightControllerDatabaseMutation } from '../../../graphql/generated/dist';

const FcFooter = () => {
  const [kernelCommand] = useChildProcessCmdMutation();
  const [clearData] = useResetFlightControllerDatabaseMutation();

  return (
    <Grid padded>
      <Grid.Column computer='14'>
        <Button.Group size='mini'>
          <Button
            onClick={() =>
              kernelCommand({
                variables: { cmd: './uav_main -t start', path: '/app/uavcast/bin/build' }
              })
            }
            positive
          >
            <Icon name='paper plane outline' />
            Connect
          </Button>
          <Button.Or />
          <Button
            onClick={() =>
              kernelCommand({
                variables: { cmd: './uav_main -t stop', path: '/app/uavcast/bin/build' }
              })
            }
            negative
          >
            <Icon name='close' />
            Disconnect
          </Button>
          {/* <Button.Or /> */}
          <Button
            onClick={() =>
              kernelCommand({
                variables: { cmd: 'journalctl -u mavlink-router.service | tail', path: '/' }
              })
            }
          >
            Mavproxy Status
          </Button>
          {/* <Button
        onClick={() =>
          kernelCommand({
            variables: { cmd: 'cat ../log/mavproxy.log' },
          })
        }
      >
        Logfile
      </Button> */}
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

export default FcFooter;
