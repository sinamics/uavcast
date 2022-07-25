import React, { useState } from 'react';
import { Button, Grid, Header, Icon } from 'semantic-ui-react';
import DownloadLogModal from './logger-download-modal';

const LoggerDownload = () => {
  const [modal, setModal] = useState(Boolean);

  return (
    <>
      {modal && <DownloadLogModal close={() => setModal(!modal)} />}
      <Grid stackable padded columns={2}>
        <Grid.Column width={11}>
          {/* download logfiles text */}
          <Header content='Download' subheader='Get system and statistic logfiles' />
        </Grid.Column>
        <Grid.Column width={5}>
          <Button icon onClick={() => setModal(!modal)} size='mini' positive>
            <Icon name='windows' /> Download Files
          </Button>
        </Grid.Column>
      </Grid>
    </>
  );
};

export default LoggerDownload;
