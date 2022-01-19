import { Form, Header, Input } from 'semantic-ui-react';
import { useUpdateEndpointMutation } from '../../../graphql/generated/dist';

interface props {
  telemetryPort: number;
  id: string;
  Eid: number;
}

const EndpointTelemetryPort = ({ telemetryPort, id, Eid }: props) => {
  const [updateEndpoint, { loading }] = useUpdateEndpointMutation();

  return (
    <Form.Field>
      <Header as='h5' content='Telemetry Port:' subheader='Specify the port you want to use for telemetry' className='m-0' />
      <Input
        loading={loading}
        onChange={(e) => updateEndpoint({ variables: { endpoint: { telemetryPort: parseInt(e.target.value, 10), id } } })}
        defaultValue={telemetryPort}
        tabIndex={Eid * 10 + 3}
        fluid
        size='mini'
        placeholder='Port...'
      />
    </Form.Field>
  );
};

export default EndpointTelemetryPort;
