import classnames from 'classnames';
import { Form, Grid, Header } from 'semantic-ui-react';
import { MavlinkDocument, useUpdateEndpointMutation } from '../../../graphql/generated/dist';
import { useSubscription } from '@apollo/client';

interface props {
  Eid: number;
  telemEnable: boolean;
  moduleActive: boolean;
  id: string;
}

const EnableTelemetry = ({ id, telemEnable, moduleActive, Eid }: props) => {
  const [updateEndpoint] = useUpdateEndpointMutation();
  const { data: { mavlink = {} } = {} } = useSubscription(MavlinkDocument);

  const { message } = mavlink || {};

  const switchTelemetryClass = classnames({
    'switch-label': true,
    'switch-red': !telemEnable || !moduleActive,
    'switch-green': message?.heartbeat?.connected && telemEnable && moduleActive,
    'switch-yellow-blink': !message?.heartbeat?.connected && telemEnable && moduleActive
  });

  return (
    <Form.Field>
      <Grid>
        <Grid.Column width={12}>
          <Header as='h5' content='Enable Telemetry' subheader='Toggle switch to enable Telemetry' className='m-0' />
        </Grid.Column>
        <Grid.Column width={4}>
          <label className='switch switch-text'>
            <input
              tabIndex={Eid * 10 + 4}
              name='telem_enable'
              type='checkbox'
              checked={telemEnable}
              className='switch-input'
              onChange={(e) => updateEndpoint({ variables: { endpoint: { telemEnable: e.target.checked, id } } })}
            />
            <span className={switchTelemetryClass} data-on='On' data-off='Off' />
            <span className='switch-handle' />
          </label>
        </Grid.Column>
      </Grid>
    </Form.Field>
  );
};

export default EnableTelemetry;
