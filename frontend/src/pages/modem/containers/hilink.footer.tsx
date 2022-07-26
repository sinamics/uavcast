import { Button } from 'semantic-ui-react';
import { useChildProcessCmdMutation } from '../../../graphql/generated/dist';

const HiLinkFooter = () => {
  const [kernelCommand] = useChildProcessCmdMutation();

  return (
    <Button.Group widths={10} fluid size='mini'>
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
      <Button
        onClick={() =>
          kernelCommand({
            variables: { cmd: 'lsusb', path: '/' }
          })
        }
      >
        USB Devices
      </Button>
      {/* <Button.Or /> */}
    </Button.Group>
  );
};

export default HiLinkFooter;
