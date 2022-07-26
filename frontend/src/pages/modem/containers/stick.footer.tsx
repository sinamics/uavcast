import { Button } from 'semantic-ui-react';
import { useChildProcessCmdMutation } from '../../../graphql/generated/dist';

const StickFooter = () => {
  const [kernelCommand] = useChildProcessCmdMutation();

  return (
    <Button.Group widths={10} fluid size='mini'>
      <Button
        onClick={() =>
          kernelCommand({
            variables: { cmd: 'ls', path: '/' }
          })
        }
        positive
      >
        Connect
      </Button>
      <Button.Or />
      <Button negative>Disconnect</Button>
      {/* <Button.Or /> */}
      <Button
        onClick={() =>
          kernelCommand({
            variables: { cmd: 'mmcli -L', path: '/' }
          })
        }
      >
        Show Modems
      </Button>
      {/* <Button.Or /> */}
      <Button
        onClick={() =>
          kernelCommand({
            variables: { cmd: 'ifconfig', path: '/' }
          })
        }
      >
        Network
      </Button>
      {/* <Button.Or /> */}
      <Button
        onClick={() =>
          kernelCommand({
            variables: { cmd: 'mmcli --simple-status -m 0', path: '/' }
          })
        }
      >
        Information
      </Button>
      {/* <Button.Or /> */}
      <Button>Status</Button>
    </Button.Group>
  );
};

export default StickFooter;
