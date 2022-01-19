import React from 'react';
import { Button, Header, Icon, Modal } from 'semantic-ui-react';

interface IProps {
  loading?: boolean;
  close: (arg: boolean) => void;
  acknowledge: () => void;
  title: string;
  content?: string;
}

const LoggerModal = ({ close, acknowledge, title, content, loading }: IProps) => {
  return (
    <Modal className='themeBg' closeIcon onClose={() => close(false)} open={true}>
      <Header icon='erase' className='themeBg theme' content={title} />
      <Modal.Content className='themeBg themeText'>{content}</Modal.Content>
      <Modal.Actions className='themeBg'>
        <Button onClick={() => close(false)}>
          <Icon name='remove' /> Back
        </Button>
        <Button loading={loading} color='orange' onClick={() => acknowledge()}>
          <Icon name='checkmark' /> Erase
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default LoggerModal;
