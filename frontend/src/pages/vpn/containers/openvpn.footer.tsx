import { Button } from 'semantic-ui-react';
import { useChildProcessCmdMutation } from '../../../graphql/generated/dist';

const HiLinkFooter = () => {
  const [kernelCommand] = useChildProcessCmdMutation();

  return (
    <Button.Group size='mini'>
      <Button
        positive
        onClick={() =>
          kernelCommand({
            variables: {
              cmd: 'sudo systemctl restart uavcast-vpn && sleep 1s && journalctl -u uavcast-vpn.service | tail',
              path: '/'
            }
          })
        }
      >
        Connect
      </Button>
      <Button.Or />
      <Button
        negative
        onClick={() =>
          kernelCommand({
            variables: {
              cmd: 'sudo systemctl stop uavcast-vpn && sleep 1s && journalctl -u uavcast-vpn.service | tail',
              path: '/'
            }
          })
        }
      >
        Disconnect
      </Button>
      <Button
        onClick={() =>
          kernelCommand({
            variables: { cmd: 'sudo journalctl -u uavcast-vpn.service | tail', path: '/' }
          })
        }
      >
        Status
      </Button>
      <Button
        onClick={() =>
          kernelCommand({
            variables: { cmd: 'ifconfig', path: '/' }
          })
        }
      >
        Network
      </Button>
    </Button.Group>
  );
};

export default HiLinkFooter;
