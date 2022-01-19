/* eslint-disable space-before-function-paren */
/* eslint-disable no-var */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Button, Grid, Header, Icon, Label } from 'semantic-ui-react';
import zlib from 'zlib';
import axios from 'axios';

import fileSaver from 'file-saver';
import { graphUrl } from '../../../utils/apolloClient';
import RestoreDatabaseModal from './restore-database-modal';

const BackupDatabase = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>('');
  const [restoreModal, setRestoreModal] = useState<boolean>(false);

  const backupDatabse = async () => {
    setLoading(true);

    await fetch(`http://${graphUrl}/api/backupSqlite`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-tar'
      }
    })
      .then(async (data) => await data.blob())
      .then((blob) => {
        fileSaver.saveAs(blob, `uavcast-database-${new Date().toLocaleDateString()}.tar.gz`);
        setLoading(false);
      })
      .catch((err: any) => {
        setError(err);
        setLoading(false);
      });
  };
  return (
    <>
      {restoreModal && <RestoreDatabaseModal close={() => setRestoreModal(false)} />}
      <Grid stackable padded columns={2}>
        {error && (
          <Grid.Column textAlign='center' width={16}>
            <Label className='themeBg' color='red'>
              {error.message}
            </Label>
          </Grid.Column>
        )}

        <Grid.Column width={10}>
          <Header content='Backup Database' subheader='backup sqlite database' />
        </Grid.Column>
        <Grid.Column width={6}>
          <Button icon loading={loading} onClick={backupDatabse} size='mini' color='orange'>
            <Icon name='download' /> Backup
          </Button>
        </Grid.Column>

        <Grid.Column width={10}>
          <Header content='Restore Database' subheader='restore sqlite database' />
        </Grid.Column>
        <Grid.Column width={6}>
          <Button icon onClick={() => setRestoreModal(!restoreModal)} size='mini' color='orange'>
            <Icon name='windows' /> Restore
          </Button>
        </Grid.Column>
      </Grid>
    </>
  );
};

export default BackupDatabase;
