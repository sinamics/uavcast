import React from 'react';
import { Card, Container, Grid, Header } from 'semantic-ui-react';
import BackupDatabase from './containers/backupDatabase';

const Backup = () => {
  return (
    <>
      <Container fluid>
        <Grid stackable padded columns={2} divided>
          <Grid.Column computer={8} mobile={16}>
            <Card fluid color='green' className='theme'>
              <Card.Content className='cardHeader'>
                <Grid.Column width={8}>
                  <Header as='h4' content='Database' subheader='backup & restore' />
                </Grid.Column>
              </Card.Content>
              <Card.Content>
                <BackupDatabase />
                {/* <Divider horizontal>Prune Files</Divider> */}
              </Card.Content>
            </Card>
          </Grid.Column>
        </Grid>
      </Container>
    </>
  );
};

export default Backup;
