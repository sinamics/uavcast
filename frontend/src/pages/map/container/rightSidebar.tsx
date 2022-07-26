import React from 'react';
import { Button, Card, Grid, Icon } from 'semantic-ui-react';
import { useChildProcessCmdMutation, useSendMavCommandMutation } from '../../../graphql/generated/dist';

const RightSidebar = ({ message = {} }: any = {}) => {
  const [kernelCommand, { loading }] = useChildProcessCmdMutation();
  const [sendCommand] = useSendMavCommandMutation();
  const { heartbeat }: any = message;

  const setFailsafe = (type: string, e: { target: { checked: any } }) => {
    const value = e.target.checked ? 1 : 0;
    sendCommand({ variables: { type, value: value.toString() } });
  };
  const { failsafe } = message;

  return (
    <React.Fragment>
      <Grid columns={1}>
        <Grid.Row style={{ padding: 0 }}>
          <Card>
            <Card.Content className='p-2'>
              <div className='d-flex flex-column justify-content-around'>
                <div className='d-flex justify-content-between m-0'>
                  <Button
                    disabled={heartbeat?.connected}
                    fluid
                    size='mini'
                    color={heartbeat?.connected ? 'olive' : 'orange'}
                    onClick={() =>
                      kernelCommand({
                        variables: { cmd: '/app/uavcast/bin/build/uav_main -t start', path: '/' }
                      })
                    }
                  >
                    <Icon name='lightning' />
                    {heartbeat?.connected ? 'Connected' : loading ? 'Connecting' : 'Connect'}
                  </Button>
                </div>
              </div>
            </Card.Content>
          </Card>
        </Grid.Row>
        <Grid.Row>
          <Card>
            <Card.Content className='p-2' style={{ opacity: heartbeat?.connected ? 1 : '0.4' }}>
              <div className='d-flex flex-column justify-content-around'>
                <span className='font-weight-bold text-center'>Pre Flight</span>
                <div className='d-flex justify-content-between'>
                  <Button
                    style={{ cursor: !heartbeat?.armed ? '' : 'not-allowed' }}
                    size='mini'
                    fluid
                    disabled={!heartbeat?.connected || heartbeat?.autopilot === 12 || heartbeat?.armed}
                    color='orange'
                    onClick={() => sendCommand({ variables: { type: 'PREFLIGHT_CALIBRATION', value: '0' } })}
                  >
                    Pre Flight Calibration
                    {/* Airspeed calibration started
                  Barometer calibration complete
                Updating barometer calibration */}
                  </Button>
                </div>

                {/* <div className='d-flex justify-content-between m-0'>
                  <Button
                    style={{
                      cursor: heartbeat?.connected ? '' : 'not-allowed'
                    }}
                    size='mini'
                    disabled={!heartbeat?.connected}
                    color='olive'
                    onClick={() => sendCommand({ variables: { type: 'COMMAND_LONG', value: '0' } })}
                  >
                    Load Mission
                  </Button>

                  <Button
                    style={{
                      cursor: heartbeat?.connected ? '' : 'not-allowed'
                    }}
                    size='mini'
                    disabled={!heartbeat?.connected}
                    color='olive'
                    onClick={() => sendCommand({ variables: { type: 'COMMAND_LONG', value: '0' } })}
                  >
                    Clear Mission
                  </Button>
                </div> */}
              </div>
            </Card.Content>
          </Card>
        </Grid.Row>
        <Grid.Row>
          <Card>
            <Card.Content
              className='p-2'
              style={{
                opacity: heartbeat?.connected ? 1 : '0.4',
                cursor: heartbeat?.connected ? '' : 'not-allowed'
              }}
            >
              <div className='d-flex flex-column justify-content-around d-flex'>
                <span className='font-weight-bold text-center'>Emerg Commands</span>
                <div className='d-flex justify-content-between mb-3'>
                  <Button
                    style={{
                      cursor: heartbeat?.connected ? '' : 'not-allowed'
                    }}
                    fluid
                    size='mini'
                    disabled={!heartbeat?.connected}
                    color='red'
                    onClick={() => sendCommand({ variables: { type: 'COMMAND_LONG', value: '20' } })}
                  >
                    Return To Launch
                  </Button>
                </div>
                <div className='d-flex justify-content-between m-0'>
                  <Button
                    style={{
                      cursor: heartbeat?.connected ? '' : 'not-allowed'
                    }}
                    fluid
                    size='mini'
                    disabled={!heartbeat?.connected}
                    color='red'
                    onClick={() => sendCommand({ variables: { type: 'COMMAND_LONG', value: '17' } })}
                  >
                    Loiter Unlimited
                  </Button>
                </div>
              </div>
            </Card.Content>
          </Card>
        </Grid.Row>
        <Grid.Row>
          <Card>
            <Card.Content className='p-2' style={{ opacity: heartbeat?.connected ? 1 : '0.4' }}>
              <div className='d-flex flex-column justify-content-between'>
                <span className='font-weight-bold text-center'>Failsafe Commands</span>
                <div style={{ fontSize: '10px' }} className='custom-control custom-checkbox'>
                  <Grid.Row>
                    <div className='custom-control custom-checkbox p-3 m-0'>
                      <input
                        onChange={(e: any) => setFailsafe('FS_GCS_ENABL', e)}
                        checked={failsafe?.gcs.param_value === 1}
                        type='checkbox'
                        className='custom-control-input'
                        id='gcs_failsafe'
                      />

                      <label className='custom-control-label' htmlFor='gcs_failsafe'>
                        <span className='text-warning'>GCS failsafe</span> will be triggered when the aircraft has not received a
                        MAVLink HEARTBEAT message. Its highly recommended to enable this feature when flying LTE.
                      </label>
                    </div>

                    <div className='custom-control custom-checkbox p-3 m-0'>
                      <input
                        onChange={(e: any) => setFailsafe('FS_SHORT_ACTN', e)}
                        checked={failsafe?.short.param_value === 1}
                        type='checkbox'
                        className='custom-control-input'
                        id='short_failsafe'
                      />
                      <label className='custom-control-label' htmlFor='short_failsafe'>
                        <span className='text-warning'>Short Failsafe.</span> A short failsafe event in plane stabilization modes
                        can be set to change mode to CIRCLE or FBWA, or be disabled completely. In QuadPlane stabilization modes,
                        it will change to QLAND or QRTL, dependent upon which Q_OPTIONS is selected.
                      </label>
                    </div>
                    <div className='custom-control custom-checkbox p-3 m-0'>
                      <input
                        onChange={(e: any) => setFailsafe('FS_LONG_ACTN', e)}
                        checked={failsafe?.long.param_value === 1}
                        type='checkbox'
                        className='custom-control-input'
                        id='long_failsafe'
                      />
                      <label className='custom-control-label' htmlFor='long_failsafe'>
                        <span className='text-warning'>Long Failsafe.</span> If the aircraft was in a stabilization or manual mode
                        when failsafe started and a long failsafe occurs then it will change to RTL mode if FS_LONG_ACTN is 0 or
                        1, and will change to FBWA and idle the throttle if FS_LONG_ACTN is set to 2.
                      </label>
                    </div>
                  </Grid.Row>
                </div>
              </div>
            </Card.Content>
          </Card>
        </Grid.Row>
      </Grid>
    </React.Fragment>
  );
};

export default RightSidebar;
