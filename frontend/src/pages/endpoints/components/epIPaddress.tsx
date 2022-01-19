import { Form, Header, Input } from 'semantic-ui-react';
import { useUpdateEndpointMutation } from '../../../graphql/generated/dist';

interface props {
  endpointIPaddress: string;
  id: string;
  Eid: number;
}

const EndpointIPaddress = ({ endpointIPaddress, id, Eid }: props) => {
  const [updateEndpoint, { loading }] = useUpdateEndpointMutation();

  return (
    <Form.Field>
      <Header
        as='h5'
        content='Receiver Address:'
        subheader='The end-point or Ground Control Station where you want to send data too.'
        className='m-0'
      />
      <Input
        loading={loading}
        defaultValue={endpointIPaddress}
        tabIndex={Eid * 10 + 2}
        onChange={(e) => updateEndpoint({ variables: { endpoint: { endpointIPaddress: e.target.value, id } } })}
        fluid
        size='mini'
        placeholder='IP...'
      />
      {/* <Header as='h5' content='Host Address:' /> */}
    </Form.Field>
  );
};

export default EndpointIPaddress;
