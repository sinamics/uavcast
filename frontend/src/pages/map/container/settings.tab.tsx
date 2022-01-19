import { Card } from 'semantic-ui-react';

const SettingsTab = () => {
  //   const { socket, dispatch, db_uavnav, db_camera } = props;
  const handleChange = (_e: any) => {
    // let cfg = { ...db_uavnav, [e.target.name]: e.target.checked };
    // dispatch({ type: SAVE_DRONECONFIG, db_collections: mongodb_collections, config: cfg, socket: socket });
  };

  return (
    <Card raised className='border-info'>
      <Card.Content className='p-2'>
        <div className='custom-control custom-checkbox d-flex flex-column justify-content-center'>
          <input name='map_auto_pan' onChange={handleChange} type='checkbox' className='custom-control-input' id='map_autopan' />

          <label className='custom-control-label' htmlFor='map_autopan'>
            Auto Pan
          </label>
        </div>
      </Card.Content>
    </Card>
  );
};

export default SettingsTab;
