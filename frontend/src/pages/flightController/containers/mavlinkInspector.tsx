import { useSubscription } from '@apollo/client';
import { Grid, Header } from 'semantic-ui-react';
import { GreenLed, RedLed } from '../../../components/led';
import { MavlinkDocument, useFlightControllerQuery } from '../../../graphql/generated/dist';
import { definitions } from '../components/definitions';

const MavlinkInspector = () => {
  const { data: { flightController = {} } = {} }: any = useFlightControllerQuery();

  const { data: { mavlink = {} } = {} } = useSubscription(MavlinkDocument);

  const { message } = mavlink || {};
  const { controller } = flightController?.data || {};

  return (
    <Grid doubling padded columns={2}>
      <Grid.Column>
        <Header
          as='h4'
          content='Mavlink Inspector'
          subheader='Check if raspberry Pi receives mavlink messages from your FlightController.
          This is usefull when troubleshooting. UAVcast will check if valid HEARTBEAT message is
          received on the selected connection method above.
          Its recommended to run this test after a reboot'
        />
      </Grid.Column>
      <Grid.Column>
        {message?.heartbeat?.connected ? (
          <Grid stackable padded columns={2}>
            <Grid.Column width={16} style={{ padding: 0 }}>
              <span className='text-success'>Success. Flight controller has proper connection with RPI</span>
            </Grid.Column>
            <Grid.Column width={8} style={{ padding: 0 }}>
              <span className='text-muted'>Connection:</span>
            </Grid.Column>

            <Grid.Column width={8} style={{ padding: 0 }}>
              <span className='float-right'>{message?.heartbeat?.connected ? <GreenLed /> : <RedLed />}</span>
            </Grid.Column>

            <Grid.Column width={8} style={{ padding: 0 }}>
              <span className='text-muted'>Frame:</span>
            </Grid.Column>
            <Grid.Column width={8} style={{ padding: 0 }}>
              <span className='float-right'>{definitions.mav_type[message?.heartbeat.type]}</span>
            </Grid.Column>

            <Grid.Column width={8} style={{ padding: 0 }}>
              <span className='text-muted'>Autopilot type:</span>
            </Grid.Column>
            <Grid.Column width={8} style={{ padding: 0 }}>
              <span className='float-right'>{definitions.mav_autopilot[message?.heartbeat.autopilot]}</span>
            </Grid.Column>

            <Grid.Column width={8} style={{ padding: 0 }}>
              <span className='text-muted'>Mavlink Version:</span>
            </Grid.Column>
            <Grid.Column width={8} style={{ padding: 0 }}>
              <span className='float-right'>{message?.heartbeat?.mavlink_version || 'not defined'}</span>
            </Grid.Column>
          </Grid>
        ) : (
          <Grid stackable padded columns={2}>
            <Grid.Column width={15}>
              <p
                className='text-danger'
                dangerouslySetInnerHTML={{
                  __html:
                    controller?.connection_type === 'usb' ? definitions.error_messages.usb : definitions.error_messages.gpio
                }}
              />
            </Grid.Column>
            <Grid.Column width={1}>
              <RedLed />
            </Grid.Column>
          </Grid>
        )}
      </Grid.Column>
    </Grid>
  );
};

export default MavlinkInspector;
