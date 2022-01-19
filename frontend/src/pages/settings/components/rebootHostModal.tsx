import React from 'react';
import { Button, Header, Icon, Modal } from 'semantic-ui-react';
import { useSupervisorCommandsMutation } from '../../../graphql/generated/dist';

const RebootHost = ({ open, close }: any) => {
  const [supervisorCommand] = useSupervisorCommandsMutation();

  const reboot = () => {
    supervisorCommand({ variables: { type: 'RESTART_HOST' } }).then(() => close());
  };
  return (
    <Modal basic onClose={() => close()} open={open} size='small'>
      <Header icon>
        <Icon name='archive' />
        Reboot host machine
      </Header>

      <Modal.Actions className='text-center'>
        <Button basic color='red' inverted onClick={() => close(false)}>
          <Icon name='remove' /> No
        </Button>
        <Button color='green' inverted onClick={() => reboot()}>
          <Icon name='checkmark' /> Reboot Now
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default RebootHost;
