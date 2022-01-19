import { Form, Header, Input } from 'semantic-ui-react';
import { useUpdateEndpointMutation } from '../../../graphql/generated/dist';

interface props {
  name: string;
  id: string;
  Eid: number;
}

const EndpointName = ({ name, id, Eid }: props) => {
  const [updateEndpoint, { loading }] = useUpdateEndpointMutation();

  return (
    <Form.Field>
      <Header as='h5' content='Connection Name:' subheader='Use a convenient name for this end-point' className='m-0' />
      <Input
        loading={loading}
        defaultValue={name}
        tabIndex={Eid * 10 + 1}
        fluid
        size='mini'
        placeholder='Name...'
        onChange={(e) => updateEndpoint({ variables: { endpoint: { name: e.target.value, id } } })}
      />
      {/* <Header as='h5' content='Host Address:' /> */}
    </Form.Field>
  );
};

export default EndpointName;
