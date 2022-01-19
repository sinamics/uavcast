import React from 'react';
import { Grid } from 'semantic-ui-react';
import PruneServerLogs from './logger-delete-server';
import PruneStatsLogs from './logger-delete-stats';
import PruneUlog from './logger-delete-ulog';

const PruneLogs = () => {
  return (
    <Grid stackable padded columns={2}>
      <PruneServerLogs />
      <PruneStatsLogs />
      <PruneUlog />
    </Grid>
  );
};

export default PruneLogs;
