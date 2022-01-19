import { Button } from 'semantic-ui-react';
import { useKernelMessageMutation } from '../../../graphql/generated/dist';

const ZerotierFooter = () => {
  const [kernelCommand] = useKernelMessageMutation();

  return (
    <Button.Group size='mini'>
      <Button
        onClick={() =>
          kernelCommand({
            variables: { cmd: 'sudo zerotier-cli info', path: '/' }
          })
        }
      >
        Online Status
      </Button>
      <Button
        onClick={() =>
          kernelCommand({
            variables: { cmd: 'sudo zerotier-cli info -j', path: '/' }
          })
        }
      >
        Details
      </Button>
      {/* <Button.Or /> */}
      <Button
        onClick={() =>
          kernelCommand({
            variables: { cmd: 'sudo zerotier-cli listpeers', path: '/' }
          })
        }
      >
        Network Peers
      </Button>
    </Button.Group>
  );
};

export default ZerotierFooter;
