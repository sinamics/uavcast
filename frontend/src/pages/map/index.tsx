import { Grid } from 'semantic-ui-react';
import { MavlinkDocument, useMapQuery } from '../../graphql/generated/dist';
import { useSubscription } from '@apollo/client';
import Map from './components/map';
import LeftSidebar from '././container/leftSidebar';
// import Px4Data from './container/mavlinkData/px4Data';
// import MavVideo from './container/video';
import RightSidebar from './container/rightSidebar';
// import SettingsTab from './container/settings.tab';
import Notifications from './container/notification';

const UavData = (props: any) => {
  const { data: { map = {} } = {}, loading: mapDataLoading }: any = useMapQuery();
  const { data: { mavlink = {} } = {} } = useSubscription(MavlinkDocument);

  if (mapDataLoading) return <div className='text-warning'>Loading...</div>;
  const { message } = mavlink;

  return (
    // <Container fluid>
    <Grid columns={1}>
      <Grid.Row style={{ padding: 0, margin: 0 }}>
        <Grid.Column style={{ padding: 0, margin: 0 }} className='map_conatiner'>
          <div className='fc_msg_text d-flex justify-content-center'>
            {/* {state.ack && (
              <div className='animated fadeIn fc_msg_text_bg d-flex flex-column align-items-center'>
                <p className='fc_msg_text_bg_textTitle text-center'>Message from Flight Controller:</p>
                <p className='fc_msg_text_bg_text'>{state.ack}</p>
              </div>
            )} */}
          </div>

          {map.mavCockpitDisable ? (
            <div className='text-center'>
              <h5>Cockpit has been disabled. You can enable this feature in settings page!</h5>
            </div>
          ) : (
            <span>
              <Map {...props} message={message}>
                <Notifications {...message} />
              </Map>
              {/* {db_camera.cam_type === 'picam' && <MavVideo {...props} />} */}
              <div className='map_mav_data'>
                {/* {mData.heartbeat.autopilot === 12 ? <Px4Data {...props} mData={mData} handleChange={handleChange} />
                : <ArduPilotData {...props} mData={mData} handleChange={handleChange} />} */}
                <LeftSidebar message={message} />
                {/* <SettingsTab {...props} /> */}
              </div>
              <div className='btn_map_overlay'>
                <RightSidebar message={message} />
              </div>
            </span>
          )}
        </Grid.Column>
      </Grid.Row>
    </Grid>
    // </Container>
  );
};

export default UavData;
