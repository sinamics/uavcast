import { useEffect, useState } from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/javascript/javascript';
import { useCameraDataQuery, useUpdateCameraMutation } from '../../../graphql/generated/dist';
import { Form, Header } from 'semantic-ui-react';

const CustomCommands = () => {
  const [state, setState] = useState<any>();
  const { data: { cameraData = {} } = {}, loading: camLoading }: any = useCameraDataQuery();
  const [storeData, { loading }] = useUpdateCameraMutation();

  const { customPipeline } = cameraData?.database || {};
  useEffect(() => {
    customPipeline && setState(customPipeline);
  }, [customPipeline]);

  const onSave = (e: any) => {
    storeData({ variables: { properties: { customPipeline: state } } });
  };

  if (camLoading || loading) return <div />;

  return (
    <Form.Field>
      <Header as='h5' subheader='[Advanced] Add your own gstreamer pipeline.' className='my-2' />
      <div onBlur={onSave}>
        <CodeMirror
          value={state}
          onBeforeChange={(editor, data, value) => setState(value)}
          options={{
            lineNumbers: true,
            autoFocus: true,
            lineWrapping: true,
            readOnly: false,
            mode: 'javascript',
            theme: 'dracula'
          }}
        />
      </div>
    </Form.Field>
  );
};

export default CustomCommands;
