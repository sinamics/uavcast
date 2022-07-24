import React, { useState } from 'react';
import { Button, Grid, Header, Icon } from 'semantic-ui-react';
import { usePruneLogFilesMutation } from '../../../graphql/generated/dist';
import LoggerModal from '../components/modal';

const PruneDockerLogs = () => {
  const [modal, setModal] = useState<boolean>(false);
  const [deleteFiles, { loading: sysLoading }] = usePruneLogFilesMutation();

  const pruneFiles = (service: string) => {
    deleteFiles({ variables: { service } }).then(() => setModal(false));
  };
  return (
    <>
      {modal && (
        <LoggerModal
          title='Prune Docker logfiles'
          content='This will remove all docker logfiles and reset them'
          close={() => setModal(false)}
          acknowledge={() => pruneFiles('docker')}
          loading={sysLoading}
        />
      )}
      <Grid.Column width={11}>
        <Header content='Docker Logger' subheader='Prune docker logs' />
      </Grid.Column>
      <Grid.Column width={5}>
        {/* <Button loading={sysLoading} onClick={() => pruneFiles('server')} size='mini' color='orange'> */}
        <Button icon loading={sysLoading} onClick={() => setModal(!modal)} size='mini' color='orange'>
          <Icon name='windows' /> Prune Files
        </Button>
      </Grid.Column>
    </>
  );
};

export default PruneDockerLogs;
