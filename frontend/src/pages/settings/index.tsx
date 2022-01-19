import { Card, Container, Grid, Header } from 'semantic-ui-react';
import Application from './containers/application';
import Host from './containers/host';
import Supervisor from './containers/supervisor';
import Uavcast from './containers/uavcast';

const Settings = () => {
  return (
    <Container fluid>
      <Grid stackable padded columns={2} divided>
        <Grid.Column computer={8} mobile={16}>
          <Card fluid color='green' className='theme'>
            <Card.Content className='cardHeader'>
              <Grid.Column width={8}>
                <Header as='h4' content='uavcast' subheader='application settings' />
              </Grid.Column>
            </Card.Content>
            <Card.Content>
              <Application />
            </Card.Content>
          </Card>
          <Grid stretched stackable columns={1}>
            <Grid.Column computer={16} mobile={16}>
              <Grid stackable columns={1}>
                <Grid.Column computer={8} mobile={8}>
                  <Supervisor />
                </Grid.Column>
                <Grid.Column computer={8} mobile={8}>
                  <Uavcast />
                </Grid.Column>
              </Grid>
            </Grid.Column>
          </Grid>
          <Card fluid color='green' className='theme'>
            <Card.Content className='cardHeader'>
              <Grid.Column width={8}>
                <Header as='h4' content='Host' subheader='host device settings' />
              </Grid.Column>
            </Card.Content>
            <Card.Content>
              <Host />
            </Card.Content>
          </Card>
        </Grid.Column>
      </Grid>
    </Container>
  );
};

export default Settings;
