import { Menu, Segment } from 'semantic-ui-react';

import UlogViewer from './containers/ulog';

const Logviewer = () => {
  return (
    <>
      <Menu size='mini' attached='top' tabular>
        <Menu.Item className='themeBg themeText' style={{ cursor: 'pointer' }} active={true} name='Flight Log' />
        <Menu.Item className='themeBg themeText' disabled name='System Log' />
        <Menu.Menu position='right'>
          <Menu.Item></Menu.Item>
        </Menu.Menu>
      </Menu>
      <Segment className='themeBg' attached='bottom'>
        <UlogViewer />
      </Segment>
    </>
  );
};

export default Logviewer;
