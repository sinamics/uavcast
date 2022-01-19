import React, { useState } from 'react';
import { Button, Grid, Header, Icon } from 'semantic-ui-react';
import { useRemoveAllLogfilesMutation } from '../../../graphql/generated/dist';
import LoggerModal from '../components/modal';

const PruneUlog = () => {
  const [modal, setModal] = useState<boolean>(false);
  const [removeUlogFiles, { loading: ulogLoading }] = useRemoveAllLogfilesMutation({
    onCompleted: () => setModal(false)
  });

  return (
    <>
      {modal && (
        <LoggerModal
          title='Prune flight logs (ulog)'
          content='This will remove all flight logs and reset them'
          close={() => setModal(false)}
          acknowledge={() => removeUlogFiles()}
          loading={ulogLoading}
        />
      )}
      <Grid.Column width={11}>
        <Header content='Flight Logger' subheader='Prune all flight logs (ulog)' />
      </Grid.Column>
      <Grid.Column width={5}>
        <Button icon loading={ulogLoading} onClick={() => setModal(!modal)} size='mini' color='orange'>
          <Icon name='windows' /> Prune Files
        </Button>
      </Grid.Column>
    </>
  );
};

export default PruneUlog;
