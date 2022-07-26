import { useEffect, useState } from 'react';
import { useSubscription } from '@apollo/client';
import { Button, Card, Icon } from 'semantic-ui-react';
import { StatusDocument, useChildProcessCmdMutation } from '../../../graphql/generated/dist';

interface IStatus {
  uavcast_systemd_active?: boolean;
  uavcast_systemd_enabled?: boolean;
}

const SimulateStartup = () => {
  const [loading, setLoading] = useState<IStatus>();

  const { data: { status } = {} } = useSubscription(StatusDocument);
  const [kernelCommand] = useChildProcessCmdMutation();

  useEffect(() => {
    setLoading({});
  }, [status?.uavcast_systemd_active, status?.uavcast_systemd_enabled]);

  const sendKernelCommands = (e: any, cmd: string) => {
    setLoading({
      ...loading,
      [e.target.name]: true
    });

    kernelCommand({
      variables: { cmd, path: '/' }
    });
  };
  return (
    <Card.Group>
      <Card className='theme'>
        <Card.Content>
          {/* <Image floated='right' size='mini' src='/images/avatar/large/steve.jpg' /> */}
          <Card.Header className='themeText'>Simulate uavcast startup</Card.Header>
          <Card.Meta className='themeSubText'>simualate</Card.Meta>
          <Card.Description>
            Test the startup sequence of enabled items. When Autostart is enabled, it will run this command automatically during
            startup.
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
          <div className='ui two buttons'>
            <Button
              name='uavcast_systemd_active'
              onClick={(event) => sendKernelCommands(event, 'sudo systemctl start uavcast')}
              loading={loading?.uavcast_systemd_active}
              disabled={status?.uavcast_systemd_active}
              positive
            >
              <Icon name='play' />
              Simulate
            </Button>
            <Button.Or />
            <Button
              name='uavcast_systemd_active'
              onClick={(event) => sendKernelCommands(event, 'sudo systemctl stop uavcast')}
              disabled={!status?.uavcast_systemd_active}
              loading={loading?.uavcast_systemd_active}
            >
              <Icon name='close' />
              Stop
            </Button>
          </div>
        </Card.Content>
      </Card>
      <Card className='theme'>
        <Card.Content>
          {/* <Image floated='right' size='mini' src='/images/avatar/large/molly.png' /> */}
          <Card.Header className='themeText'>Enable Autorun</Card.Header>
          <Card.Meta className='themeSubText'>Startup</Card.Meta>
          <Card.Description>Enable if you want UAVcast to start automatically during startup</Card.Description>
        </Card.Content>
        <Card.Content extra>
          <div className='ui two buttons'>
            <Button
              name='uavcast_systemd_enabled'
              onClick={(event) => sendKernelCommands(event, 'sudo systemctl enable uavcast')}
              positive
              loading={loading?.uavcast_systemd_enabled}
              disabled={status?.uavcast_systemd_enabled}
            >
              <Icon name='play' />
              Enable
            </Button>
            <Button.Or />
            <Button
              name='uavcast_systemd_enabled'
              onClick={(event) => sendKernelCommands(event, 'sudo systemctl disable uavcast')}
              loading={loading?.uavcast_systemd_enabled}
              disabled={!status?.uavcast_systemd_enabled}
            >
              <Icon name='close' />
              Disable
            </Button>
          </div>
        </Card.Content>
      </Card>
    </Card.Group>
  );
};

export default SimulateStartup;
