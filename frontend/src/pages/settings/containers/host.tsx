import React, { useState } from 'react';
import { Button, Grid, Header, Icon } from 'semantic-ui-react';
import RebootHost from '../components/rebootHostModal';

const Host = () => {
  const [modal, setModal] = useState<boolean>();

  const toggleModal = () => {
    setModal((prev) => !prev);
  };
  return (
    <Grid stackable padded columns={2}>
      <RebootHost open={modal} close={toggleModal} />
      <Grid.Column>
        <Header content='Reboot' subheader='Restart host machine' />
      </Grid.Column>
      <Grid.Column textAlign='center'>
        <Button icon color='orange' onClick={toggleModal} size='mini'>
          <Icon name='windows' />
          Reboot
        </Button>
      </Grid.Column>
    </Grid>
  );
};
export default Host;
