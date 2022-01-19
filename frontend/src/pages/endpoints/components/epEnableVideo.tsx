import classnames from 'classnames';
import { Form, Grid, Header } from 'semantic-ui-react';
import { useUpdateEndpointMutation } from '../../../graphql/generated/dist';

interface props {
  status: any;
  telemEnable: boolean;
  moduleActive: boolean;
  videoEnable: boolean;
  video: boolean;
  id: string;
  Eid: number;
}

const EnableVideo = ({ status, moduleActive, videoEnable, id, Eid }: props) => {
  const [updateEndpoint] = useUpdateEndpointMutation();

  const switchVideoClass = classnames({
    'switch-label': true,
    'switch-yellow-blink': !status.video && videoEnable && moduleActive,
    'switch-green': status.video && videoEnable && moduleActive,
    'switch-red': !videoEnable || !moduleActive,
    'switch-off': !videoEnable
  });
  return (
    <Form.Field>
      <Grid>
        <Grid.Column width={12}>
          <Header as='h5' content='Enable Video' subheader='Toggle switch to enable video' className='m-0' />
        </Grid.Column>
        <Grid.Column width={4}>
          <label className='switch switch-text'>
            <input
              //   disabled={!db_data.module_active}
              tabIndex={Eid * 10 + 5}
              name='telem_enable'
              type='checkbox'
              checked={videoEnable}
              className='switch-input'
              onChange={(e) => updateEndpoint({ variables: { endpoint: { videoEnable: e.target.checked, id } } })}
            />
            <span className={switchVideoClass} data-on='On' data-off='Off' />
            <span className='switch-handle' />
          </label>
        </Grid.Column>
      </Grid>
    </Form.Field>
  );
};

export default EnableVideo;
