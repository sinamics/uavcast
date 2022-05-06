import { useState } from 'react';
import { Menu, Segment } from 'semantic-ui-react';
import DockerLog from './containers/dockerLog';
import ServerLog from './containers/serverLog';

import UlogViewer from './containers/ulog';

const Logviewer = () => {
  const [activeItem, setActiveItem] = useState({ name: 'Flight Log' });
  const handleClick = (e: any, { name }: any) => setActiveItem({ name });

  return (
    <>
      <Menu size='mini' attached='top' tabular>
        <Menu.Item
          className='themeBg themeText'
          onClick={handleClick}
          style={{ cursor: 'pointer' }}
          active={activeItem.name === 'Flight Log'}
          name='Flight Log'
        />
        <Menu.Item
          className='themeBg themeText'
          onClick={handleClick}
          style={{ cursor: 'pointer' }}
          active={activeItem.name === 'System Log'}
          name='System Log'
        />
        <Menu.Item
          className='themeBg themeText'
          onClick={handleClick}
          style={{ cursor: 'pointer' }}
          active={activeItem.name === 'Docker Log'}
          name='Docker Log'
        />
        <Menu.Menu position='right'>
          <Menu.Item></Menu.Item>
        </Menu.Menu>
      </Menu>
      <Segment className='themeBg' attached='bottom'>
        {activeItem.name === 'Flight Log' && <UlogViewer />}
        {activeItem.name === 'System Log' && <ServerLog />}
        {activeItem.name === 'Docker Log' && <DockerLog />}
      </Segment>
    </>
  );
};

export default Logviewer;
