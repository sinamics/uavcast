import { Button, Card, Dimmer, Divider, Form, Grid, Header, Icon, Segment } from 'semantic-ui-react';
import { GetEndpointsDocument, useRemoveEndpointMutation } from '../../../graphql/generated/dist';
import EndpointName from '../components/epName';
import EndpointIPaddress from '../components/epIPaddress';
import EndpointTelemetryPort from '../components/epTelemetryPort';
import EnableTelemetry from '../components/epEnableTelem';
import EnableVideo from '../components/epEnableVideo';
import ModuleActive from '../components/apModuleActive';
import EndpointVideoPort from '../components/epVideoPort';

const Destination = ({ status, endpoint, Eid }: any) => {
  const [removeEndpoint, { loading: removeEndpointLoading }] = useRemoveEndpointMutation();

  const handleRemoveItem = (id: string) => {
    removeEndpoint({
      variables: { id },
      update(store, { data }) {
        const { getEndpoints } = store.readQuery<any>({
          query: GetEndpointsDocument
        });
        store.writeQuery<any>({
          query: GetEndpointsDocument,
          data: {
            getEndpoints: { ...getEndpoints, ...data?.removeEndpoint }
          }
        });
      }
    });
  };

  return (
    <Card>
      <Card.Content className='cardHeader'>
        <Grid>
          <Grid.Column width={12}>
            <Card.Header>
              <Header as='h4'>{`${endpoint.name ? endpoint.name : `Destination # ${Eid + 1}`}`}</Header>
            </Card.Header>
          </Grid.Column>

          <Grid.Column width={4}>
            <ModuleActive {...endpoint} />
          </Grid.Column>
        </Grid>
      </Card.Content>
      <Dimmer.Dimmable style={{ border: 'none', backgroundColor: '#f6f6f6', marginTop: 0 }} as={Segment} dimmed>
        <Dimmer active={!endpoint.moduleActive}>
          <Header as='h2' icon inverted>
            <Icon color='orange' name='paper plane outline' />
            Disabled
          </Header>
        </Dimmer>
        <Card.Content style={{ marginBottom: 20 }}>
          <Form>
            {/* endpoint name */}
            <EndpointName {...endpoint} Eid={Eid} />

            {/* endpoint address */}
            <EndpointIPaddress {...endpoint} Eid={Eid} />

            {/* endpoint telemetry Port */}
            <EndpointTelemetryPort {...endpoint} Eid={Eid} />

            {/* endpoint video Port */}
            <EndpointVideoPort {...endpoint} Eid={Eid} />

            <Divider />

            {/* Enable telemetry */}
            <EnableTelemetry {...endpoint} Eid={Eid} />

            {/* Enable Video */}
            <EnableVideo {...endpoint} status={status} Eid={Eid} />

            {/* </Grid> */}
          </Form>
        </Card.Content>
        <Card.Content extra>
          <Button loading={removeEndpointLoading} onClick={() => handleRemoveItem(endpoint.id)} color='orange' fluid>
            <Icon name='trash alternate outline' />
            Remove
          </Button>
        </Card.Content>
      </Dimmer.Dimmable>
    </Card>
  );
};

export default Destination;
