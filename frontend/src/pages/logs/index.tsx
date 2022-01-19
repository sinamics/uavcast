import { Card, Container, Divider, Grid, Header } from 'semantic-ui-react';
import LoggerDownload from './containers/logger-download';
import PruneLogs from './containers/logger-delete';

const Logs = () => {
  return (
    <Container fluid>
      <Grid stackable padded columns={2} divided>
        <Grid.Column computer={8} mobile={16}>
          <Card fluid color='green' className='theme'>
            <Card.Content className='cardHeader'>
              <Grid.Column width={8}>
                <Header as='h4' content='Logs' subheader='Download application logs' />
              </Grid.Column>
            </Card.Content>
            <Card.Content>
              <LoggerDownload />
              <Divider horizontal>Prune Files</Divider>
              <PruneLogs />
            </Card.Content>
          </Card>
        </Grid.Column>
      </Grid>
    </Container>
  );
};

export default Logs;
