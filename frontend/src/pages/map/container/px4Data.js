// import React, { useState, useEffect } from 'react';
// import { Card, CardBody, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
// import { gps_fix, frame, mav_autopilot } from '../definitions';

// const MavData = ({ mData, handleChange, db_uavnav = {}, socket }) => {
//   const [state, setState] = useState({ open: false });
//   const [Hz, setHz] = useState({ interval: 1, name: '1Hz' });
//   const { gps_raw_int, sys_status, vfr_hud, heartbeat, altitude } = mData;

//   useEffect(() => {
//     setHz({ value: db_uavnav.mav_update_hz, name: String(1000 / db_uavnav.mav_update_hz).charAt(0) + 'Hz' });
//   }, [db_uavnav]);

//   const toggle = () => setState({ open: !state.open });
//   const changeHandler = (e) => {
//     setHz({ value: e.target.value, name: e.target.textContent });
//     handleChange({ value: parseInt(e.target.value, 10), name: 'mav_update_hz' });

//     socket.emit('MAV_UPDATE_INTERVAL', parseInt(e.target.value, 10));
//   };

//   return (
//     <React.Fragment>
//       <Card outline color='success' className='border-primary'>
//         <CardBody className='p-2'>
//           <div className='text-center font-weight-bold'>LINK</div>
//           <div className='d-flex justify-content-between m-0'>
//             <span className='text-muted'>UPDATE INTERVAL</span>
//             <span>
//               <Dropdown isOpen={state.open} size='sm' toggle={toggle}>
//                 <DropdownToggle style={{ fontSize: '10px' }} caret>
//                   {Hz.name}
//                 </DropdownToggle>
//                 <DropdownMenu>
//                   <DropdownItem value={1000} onClick={changeHandler}>
//                     1Hz
//                   </DropdownItem>
//                   <DropdownItem value={500} onClick={changeHandler}>
//                     2Hz
//                   </DropdownItem>
//                   <DropdownItem value={333} onClick={changeHandler}>
//                     3Hz
//                   </DropdownItem>
//                   <DropdownItem value={250} onClick={changeHandler}>
//                     4Hz
//                   </DropdownItem>
//                   <DropdownItem value={200} onClick={changeHandler}>
//                     5Hz
//                   </DropdownItem>
//                 </DropdownMenu>
//               </Dropdown>
//             </span>
//           </div>
//           <div className='d-flex justify-content-between m-0'>
//             <span className='text-muted'>PACKET LOSS</span>
//             <span>{sys_status.errors_comm ? sys_status.errors_comm : 0}</span>
//           </div>
//           <div className='d-flex justify-content-between m-0'>
//             <span className='text-muted'>CONNECTED GCS</span>
//             <span>{heartbeat.numOfGcs ? heartbeat.numOfGcs.length : 0}</span>
//           </div>
//         </CardBody>
//       </Card>

//       <Card className='border-primary'>
//         <CardBody className='p-2'>
//           <div className='text-center font-weight-bold'>FC</div>
//           <div className='d-flex justify-content-between'>
//             <span className='text-muted'>ARMED</span>
//             <span>{heartbeat.base_mode ? (heartbeat.base_mode & 128 ? 'READY TO FLY' : 'DISARMED') : ''}</span>
//           </div>
//           {/* <div className="d-flex justify-content-between">
//             <span className="text-muted">MODE</span>
//             <span>{heartbeat.base_mode ? mav_mode[heartbeat.base_mode] : 'UNKNOWN'}</span>
//           </div> */}
//           <div className='d-flex justify-content-between'>
//             <span className='text-muted'>FRAME</span>
//             <span>{heartbeat.type ? frame[heartbeat.type].toUpperCase() : ''}</span>
//           </div>
//           <div className='d-flex justify-content-between'>
//             <span className='text-muted'>FIRMWARE</span>
//             <span>{heartbeat.autopilot ? mav_autopilot[heartbeat.autopilot].toUpperCase() : ''}</span>
//           </div>
//           <div className='d-flex justify-content-between m-0'>
//             <span className='text-muted'>THROTTLE</span>
//             <span>{vfr_hud.throttle ? vfr_hud.throttle : 0}</span>
//           </div>
//           {/* <div className="d-flex justify-content-between m-0">
//             <span className="text-muted">FUEL</span>
//             <span>4,6 LITER</span>
//           </div> */}
//         </CardBody>
//       </Card>
//       <Card className='border-primary'>
//         <CardBody className='p-2'>
//           <div className='text-center font-weight-bold'>GPS</div>
//           <div className='d-flex justify-content-between m-0'>
//             <span className='text-muted'>GPS LOCK</span>
//             <span>{gps_raw_int.fix_type ? gps_fix[gps_raw_int.fix_type] : 'No Lock'}</span>
//           </div>
//           <div className='d-flex justify-content-between m-0'>
//             <span className='text-muted'>SATELITTES</span>
//             <span>{gps_raw_int.satellites_visible ? gps_raw_int.satellites_visible : 0}</span>
//           </div>
//           <div className='d-flex justify-content-between m-0'>
//             <span className='text-muted'>ALTITUDE (REL)</span>
//             <span>{altitude.altitude_relative ? Math.round(altitude.altitude_relative * 10) / 10 + ' m' : ' m'}</span>
//           </div>
//           <div className='d-flex justify-content-between m-0'>
//             <span className='text-muted'>SPEED </span>
//             <span>{gps_raw_int.vel ? Math.round(gps_raw_int.vel * 0.036 * 10) / 10 + ' Km/t' : 0 + ' Km/t'}</span>
//           </div>
//           <div className='d-flex justify-content-between m-0'>
//             <span className='text-muted'>AIRSPEED </span>
//             <span>{vfr_hud.airspeed ? Math.round(vfr_hud.airspeed * 3.6 * 10) / 10 + ' Km/t' : 0 + ' Km/t'}</span>
//           </div>
//           <div className='d-flex justify-content-between m-0'>
//             <span className='text-muted'>GROUNDSPEED </span>
//             <span>{vfr_hud.groundspeed ? Math.round(vfr_hud.groundspeed * 3.6 * 10) / 10 + ' Km/t' : 0 + ' Km/t'}</span>
//           </div>
//           <div className='d-flex justify-content-between m-0'>
//             <span className='text-muted'>HEADING </span>
//             <span>{vfr_hud.heading ? vfr_hud.heading + ' Deg' : 0}</span>
//           </div>
//         </CardBody>
//       </Card>
//       <Card className='border-primary'>
//         <CardBody className='p-2'>
//           <div className='text-center font-weight-bold'>POWER</div>
//           {/* <div className="d-flex justify-content-between m-0">
//             <span className="text-muted">FC Vcc</span>
//             <span>{power_status.voltage ? power_status.voltage / 1000 + ' V' : ''}</span>
//           </div> */}
//           <div className='d-flex justify-content-between m-0'>
//             <span className='text-muted'>BATTERY Vcc</span>
//             <span>
//               {sys_status.voltage_battery
//                 ? sys_status.voltage_battery === 65535
//                   ? ''
//                   : sys_status.voltage_battery / 1000 + ' V'
//                 : ''}
//             </span>
//           </div>
//           {/* <div className="d-flex justify-content-between m-0">
//             <span className="text-muted">SOURCE</span>
//             <span>{power_status.flags ? power[power_status.flags] : ''}</span>
//           </div> */}
//           <div className='d-flex justify-content-between m-0'>
//             <span className='text-muted'>CURRENT CONSUMED</span>
//             <span>{sys_status.current_consumed ? sys_status.current_consumed + ' mAh' : ''}</span>
//           </div>
//         </CardBody>
//       </Card>
//     </React.Fragment>
//   );
// };

// export default MavData;
