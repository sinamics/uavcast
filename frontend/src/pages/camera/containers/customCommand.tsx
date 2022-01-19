import { useEffect, useState } from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/javascript/javascript';
import { useCameraDataQuery, useUpdateCameraMutation } from '../../../graphql/generated/dist';

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
  );
};

export default CustomCommands;
