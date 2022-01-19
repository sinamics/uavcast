/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios';
import React from 'react';
import { Button, Header, Icon, Modal } from 'semantic-ui-react';
import DatabaseDropzone from './dropzone';

function RestoreDatabaseModal({ close }: any) {
  return (
    <Modal className='themeBg' closeIcon onClose={() => close(false)} open={true}>
      <Header icon='upload' className='themeBg theme' content='Restore Database' />
      <Modal.Content className='themeBg themeText'>
        <p>Select backup file to restore from</p>
      </Modal.Content>
      <Modal.Content className='themeBg themeText'>
        <DatabaseDropzone />
      </Modal.Content>
      <Modal.Actions className='themeBg'>
        <Button onClick={() => close(false)}>
          <Icon name='remove' /> Back
        </Button>
        {/* <Button>
          <Icon name='download' /> Restore
        </Button> */}
      </Modal.Actions>
    </Modal>
  );
}

export default RestoreDatabaseModal;
