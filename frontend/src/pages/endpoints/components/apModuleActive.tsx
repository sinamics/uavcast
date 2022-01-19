import { useUpdateEndpointMutation } from '../../../graphql/generated/dist';

interface props {
  status: any;
  telemEnable: boolean;
  moduleActive: boolean;
  id: string;
}

const ModuleActive = ({ id, moduleActive }: props) => {
  const [updateEndpoint] = useUpdateEndpointMutation();

  return (
    <label className='switch switch-text switch-pill switch-success-outline m-0'>
      <input
        name='module_active'
        type='checkbox'
        className='switch-input'
        checked={moduleActive}
        onChange={(e) => updateEndpoint({ variables: { endpoint: { moduleActive: e.target.checked, id } } })}
      />
      <span className='switch-label' data-on='On' data-off='Off' />
      <span className='switch-handle' />
    </label>
  );
};

export default ModuleActive;
