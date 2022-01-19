import React, { useState } from 'react';
import { Button, Grid, Header, Icon } from 'semantic-ui-react';
import { usePruneLogFilesMutation } from '../../../graphql/generated/dist';
import LoggerModal from '../components/modal';

const PruneStatsLogs = () => {
  const [modal, setModal] = useState<boolean>(false);
  const [deleteFiles, { loading: sysLoading }] = usePruneLogFilesMutation();

  const pruneFiles = (service: string) => {
    deleteFiles({ variables: { service } }).then(() => setModal(false));
  };
  return (
    <>
      {modal && (
        <LoggerModal
          title='Prune Statistic logfiles'
          content='This will remove all CPU, Network, Temperature ect logfiles and reset them'
          close={() => setModal(false)}
          acknowledge={() => pruneFiles('stats')}
          loading={sysLoading}
        />
      )}
      <Grid.Column width={11}>
        <Header content='Statistics Logger' subheader='Prune all statistics (cpu, network, temperature, ect)' />
      </Grid.Column>
      <Grid.Column width={5}>
        <Button icon loading={sysLoading} onClick={() => setModal(!modal)} size='mini' color='orange'>
          <Icon name='windows' /> Prune Files
        </Button>
      </Grid.Column>
    </>
  );
};

export default PruneStatsLogs;
