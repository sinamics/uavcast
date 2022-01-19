import { Button, Card, Container, Grid, Header, Icon } from 'semantic-ui-react';
import Destination from './containers/destination';
import ModemHelp from './aside/help';
import { GetEndpointsDocument, StatusDocument, useAddEndpointMutation, useGetEndpointsQuery } from '../../graphql/generated/dist';
import GcsPlaceholder from './components/placeHolder';
import { useSubscription } from '@apollo/client';

const GroundController = () => {
  const [addEndpoint, { loading: loadingNewEndpoint }] = useAddEndpointMutation();

  const { data: { status = { errors: {} } } = {} } = useSubscription(StatusDocument);
  const { data: { getEndpoints } = {}, loading: endpointLoading } = useGetEndpointsQuery();

  const handleAddItem = () => {
    addEndpoint({
      update(store, { data }) {
        const { getEndpoints } = store.readQuery<any>({
          query: GetEndpointsDocument
        });

        store.writeQuery<any>({
          query: GetEndpointsDocument,
          data: {
            getEndpoints: { ...getEndpoints, ...data?.addEndpoint }
          }
        });
      }
    });
  };

  return (
    <Container fluid>
      <Grid padded divided>
        <Grid.Column computer={13} mobile={16}>
          <Card fluid className='theme'>
            <Card.Content className='cardHeader'>
              <Grid.Column width={8}>
                <Header as='h4' content='Ground Control Stations' subheader='Add your destination here' />
              </Grid.Column>
            </Card.Content>
            <Card.Content>
              <Grid.Column>
                <Grid padded>
                  <Grid.Column>
                    {endpointLoading ? (
                      <GcsPlaceholder />
                    ) : (
                      <Card.Group>
                        {getEndpoints?.data?.map((endpoint, i) => (
                          <Destination key={endpoint.id} endpoint={endpoint} status={status} Eid={i} />
                        ))}

                        <Card style={{ border: 'none', boxShadow: 'none', margin: 0 }} className='theme'>
                          <Card.Content>
                            <Button loading={loadingNewEndpoint} onClick={() => handleAddItem()} icon labelPosition='left'>
                              <Icon name='add' />
                              Add Destination
                            </Button>
                          </Card.Content>
                        </Card>
                      </Card.Group>
                    )}
                  </Grid.Column>
                </Grid>
              </Grid.Column>
            </Card.Content>
          </Card>
        </Grid.Column>
        <Grid.Column computer={3} only='computer'>
          <ModemHelp />
        </Grid.Column>
      </Grid>
    </Container>
  );
};

export default GroundController;
