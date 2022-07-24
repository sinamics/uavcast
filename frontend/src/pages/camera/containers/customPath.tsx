import { useCameraDataQuery, useUpdateCameraMutation } from '../../../graphql/generated/dist';
import { Form, Header, Input } from 'semantic-ui-react';

const CustomPath = () => {
  const { data: { cameraData = {} } = {} }: any = useCameraDataQuery();
  const [storeData] = useUpdateCameraMutation();

  const { path } = cameraData?.database || {};
  return (
    <Form.Field>
      <Header
        as='h5'
        subheader='[Advanced] Specify the internal address for your connected camera. e.g /dev/video0'
        className='my-2'
      />
      <Input
        onChange={(e) => storeData({ variables: { properties: { path: e.target.value.trim() } } })}
        defaultValue={path}
        fluid
        placeholder='Example:: /dev/video0'
      />
    </Form.Field>
  );
};

export default CustomPath;
