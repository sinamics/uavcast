import { Form, Header, Input } from 'semantic-ui-react';
import { useUpdateEndpointMutation } from '../../../graphql/generated/dist';

interface props {
  videoPort: number;
  id: string;
  Eid: number;
}

const EndpointVideoPort = ({ videoPort, id, Eid }: props) => {
  const [updateEndpoint, { loading }] = useUpdateEndpointMutation();

  return (
    <Form.Field>
      <Header as='h5' content='Video Port:' subheader='Specify the port you want to use for video' className='m-0' />
      <Input
        loading={loading}
        onChange={(e) => updateEndpoint({ variables: { endpoint: { videoPort: parseInt(e.target.value, 10), id } } })}
        defaultValue={videoPort}
        tabIndex={Eid * 10 + 3}
        fluid
        size='mini'
        placeholder='Port...'
      />
    </Form.Field>
  );
};

export default EndpointVideoPort;
