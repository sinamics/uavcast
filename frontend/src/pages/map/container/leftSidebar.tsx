// import { Card, CardBody, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { gps_fix, power, mav_mode } from '../definitions';
import { RedLed, GreenLed } from '../../../components/led';
import { Card } from 'semantic-ui-react';

const ArdupilotData = ({ message = {} }: any) => {
  // const [state, setState] = useState({ open: false, connected: false });
  // const [Hz, setHz] = useState({ interval: 1, name: '1Hz' });
  const { gps_raw_int, power_status, sys_status, vfr_hud, heartbeat } = message;
  // console.log(connected);
  // useEffect(() => {
  //   setHz({ value: db_uavnav.mav_update_hz, name: String(1000 / db_uavnav.mav_update_hz).charAt(0) + 'Hz' });
  // }, [db_uavnav]);

  // const toggle = () => setState({ open: !state.open });
  // const changeHandler = (e) => {
  //   setHz({ value: e.target.value, name: e.target.textContent });
  //   handleChange({ value: parseInt(e.target.value, 10), name: 'mav_update_hz' });

  //   socket.emit('MAV_UPDATE_INTERVAL', parseInt(e.target.value, 10));
  // };
  // console.log(heartbeat);

  const MavConnected = () => {
    if (heartbeat?.connected) {
      if (heartbeat.armed) return <span className='text-success'>READY TO FLY</span>;
      return <span className='text-danger'>DISARMED</span>;
    }
    return null;
  };
  return (
    <>
      <Card raised>
        <Card.Content>
          <div className='text-center font-weight-bold'>LINK {heartbeat?.connected ? <GreenLed /> : <RedLed />}</div>
          <div className='d-flex justify-content-between m-0'>
            <span className='text-muted'>UPDATE INTERVAL</span>
            <span>
              {/* <Dropdown isOpen={state.open} size='sm' toggle={toggle}>
                <DropdownToggle style={{ fontSize: '10px', paddingTop: 0, paddingBottom: 0 }} caret>
                  {Hz.name}
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem value={1000} onClick={changeHandler}>
                    1Hz
                  </DropdownItem>
                  <DropdownItem value={500} onClick={changeHandler}>
                    2Hz
                  </DropdownItem>
                  <DropdownItem value={333} onClick={changeHandler}>
                    3Hz
                  </DropdownItem>
                  <DropdownItem value={250} onClick={changeHandler}>
                    4Hz
                  </DropdownItem>
                  <DropdownItem value={200} onClick={changeHandler}>
                    5Hz
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown> */}
            </span>
          </div>
          <div className='d-flex justify-content-between m-0'>
            <span className='text-muted'>PACKET LOSS</span>
            <span>{sys_status?.errors_comm ? sys_status.errors_comm : 0}</span>
          </div>
          <div className='d-flex justify-content-between m-0'>
            <span className='text-muted'>CONNECTED GCS</span>
            <span>{heartbeat?.numOfGcs ? heartbeat.numOfGcs.length : 0}</span>
          </div>
        </Card.Content>
      </Card>

      <Card className='border-primary'>
        <Card.Content className='p-2'>
          <div className='text-center font-weight-bold'>FC</div>
          <div className='d-flex justify-content-between'>
            <span className='text-muted'>ARMED</span>
            <span>{MavConnected()}</span>
          </div>
          <div className='d-flex justify-content-between'>
            <span className='text-muted'>MODE</span>
            <span>{heartbeat?.connected ? mav_mode(heartbeat.type)[heartbeat.custom_mode] : ''}</span>
          </div>
          <div className='d-flex justify-content-between'>
            <span className='text-muted'>FRAME</span>
            <span>{heartbeat?.connected ? heartbeat?.frame.toUpperCase() : ''}</span>
          </div>
          <div className='d-flex justify-content-between'>
            <span className='text-muted'>FIRMWARE</span>
            <span>{heartbeat?.connected ? heartbeat?.firmware.toUpperCase() : ''}</span>
          </div>
          <div className='d-flex justify-content-between m-0'>
            <span className='text-muted'>THROTTLE</span>
            <span>{vfr_hud?.throttle ? vfr_hud.throttle : 0}</span>
          </div>
          {/* <div className="d-flex justify-content-between m-0">
            <span className="text-muted">FUEL</span>
            <span>4,6 LITER</span>
          </div> */}
        </Card.Content>
      </Card>

      <Card className='border-primary'>
        <Card.Content className='p-2'>
          <div className='text-center font-weight-bold'>GPS</div>
          <div className='d-flex justify-content-between m-0'>
            <span className='text-muted'>GPS LOCK</span>
            <span>{gps_raw_int?.fix_type ? gps_fix[gps_raw_int?.fix_type] : 'No Lock'}</span>
          </div>
          <div className='d-flex justify-content-between m-0'>
            <span className='text-muted'>SATELITTES</span>
            <span>{gps_raw_int?.satellites_visible ? gps_raw_int?.satellites_visible : 0}</span>
          </div>
          <div className='d-flex justify-content-between m-0'>
            <span className='text-muted'>ALTITUDE (MSL)</span>
            <span>{vfr_hud?.alt ? Math.round(vfr_hud.alt * 10) / 10 + ' m' : 0 + ' m'}</span>
          </div>
          <div className='d-flex justify-content-between m-0'>
            <span className='text-muted'>SPEED </span>
            <span>{gps_raw_int?.vel ? Math.round(gps_raw_int?.vel * 0.036 * 10) / 10 + ' Km/t' : 0 + ' Km/t'}</span>
          </div>
          <div className='d-flex justify-content-between m-0'>
            <span className='text-muted'>AIRSPEED </span>
            <span>{vfr_hud?.airspeed ? Math.round(vfr_hud.airspeed * 3.6 * 10) / 10 + ' Km/t' : 0 + ' Km/t'}</span>
          </div>
          <div className='d-flex justify-content-between m-0'>
            <span className='text-muted'>GROUNDSPEED </span>
            <span>{vfr_hud?.groundspeed ? Math.round(vfr_hud.groundspeed * 3.6 * 10) / 10 + ' Km/t' : 0 + ' Km/t'}</span>
          </div>
          <div className='d-flex justify-content-between m-0'>
            <span className='text-muted'>HEADING </span>
            <span>{vfr_hud?.heading ? vfr_hud.heading + ' Deg' : 0}</span>
          </div>
        </Card.Content>
      </Card>

      {/* only ardupilot (3) has power status  */}
      {heartbeat?.autopilot === 3 && (
        <Card className='border-primary'>
          <Card.Content className='p-2'>
            <div className='text-center font-weight-bold'>POWER</div>
            <div className='d-flex justify-content-between m-0'>
              <span className='text-muted'>FC Vcc</span>
              <span>{power_status?.Vcc ? power_status.Vcc / 1000 + ' V' : 0 + ' V'}</span>
            </div>
            <div className='d-flex justify-content-between m-0'>
              <span className='text-muted'>SERVO RAIL Vcc</span>
              <span>{power_status?.Vservo ? power_status.Vservo / 1000 + ' V' : '0 V'}</span>
            </div>
            <div className='d-flex justify-content-between m-0'>
              <span className='text-muted'>SOURCE</span>
              <span>{power_status?.flags ? power[power_status.flags] : ''}</span>
            </div>
            <div className='d-flex justify-content-between m-0'>
              <span className='text-muted'>BATTERY VOLTAGE</span>
              <span>{sys_status?.voltage_battery ? sys_status.voltage_battery / 1000 + ' V' : '0 V'}</span>
            </div>
          </Card.Content>
        </Card>
      )}
    </>
  );
};

export default ArdupilotData;
