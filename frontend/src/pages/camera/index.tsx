import { useSubscription } from '@apollo/client';
import { Card, Container, Grid, Header } from 'semantic-ui-react';
import RaspberryConsole from '../../components/CodeMirror';
import { Camera_StdoutDocument, StatusDocument, useCameraDataQuery, useGetDockerLogMutation } from '../../graphql/generated/dist';
import VideoHelp from './components/help';
import BitratePrSecond from './containers/bitratePrSecond';
import CameraType from './containers/cameraSelect';
import CameraFooter from './containers/footer';
import FramesPrSecond from './containers/framesPrSecond';
import CameraProtocol from './containers/protocol';
import CameraResolution from './containers/resolution';
// import CameraRotation from './containers/rotation';
import CameraContrast from './containers/contrast';
import CameraFlip from './containers/flip';
import CameraBrightness from './containers/brightness';
import { useEffect, useState } from 'react';
import { GreenLed, RedLed } from '../../components/led';

const Camera = () => {
  const [logMsg, setLogMsg] = useState('');

  const { data: { status } = {} } = useSubscription(StatusDocument);
  const { data: { camera_stdout = { message: '', errors: {} } } = {} } = useSubscription(Camera_StdoutDocument);

  const [getDockerLogs, { data: { getDockerLog = {} } = {} }]: any = useGetDockerLogMutation({
    variables: { properties: { minutes: 5 } }
  });

  const { data: { cameraData = {} } = {} }: any = useCameraDataQuery();

  const { protocol } = cameraData?.database || {};
  const { file = [] } = getDockerLog || {};

  useEffect(() => {
    setLogMsg(camera_stdout.message);
  }, [camera_stdout.message]);

  useEffect(() => {
    if (file.length > 0) {
      setLogMsg(file.map((e: any) => e.timestamp + ': ' + e.message.trim()));
    }
  }, [file]);

  return (
    <Container fluid>
      <Grid stackable padded columns={2} divided>
        <Grid.Column computer={13} mobile={16}>
          <Card fluid className='theme'>
            <Card.Content className='cardHeader'>
              <Grid centered columns={2}>
                <Grid.Column width={5}>
                  <Header as='h4' content='Camera' subheader='gstreamer configuration' />
                </Grid.Column>
                <Grid.Column floated='right' verticalAlign='middle' width={1}>
                  {status?.video ? <GreenLed /> : <RedLed />}
                </Grid.Column>
              </Grid>
            </Card.Content>

            <Card.Content>
              {/* Select Cameratype */}
              <CameraType />

              {/* Select protocol */}
              <CameraProtocol />

              {/* Select resolution */}
              <CameraResolution />

              {/* Frames pr. sec  */}
              <FramesPrSecond />

              {protocol !== 'rtsp' && (
                <>
                  {/* Flip Camera */}
                  <CameraFlip />

                  {/* Bitrate pr. sec  */}
                  <BitratePrSecond />

                  {/* Rotation  */}
                  {/* <CameraRotation /> */}

                  {/* Contrast */}
                  <CameraContrast />

                  {/* Brightness*/}
                  <CameraBrightness />
                </>
              )}

              {/* Footer  */}
              <CameraFooter getDockerLogs={getDockerLogs} />
              <Grid padded columns={1}>
                <Grid.Column style={{ height: '300px' }}>
                  <RaspberryConsole stdout={logMsg} error={camera_stdout.errors} />
                </Grid.Column>
              </Grid>
            </Card.Content>
          </Card>
        </Grid.Column>
        <Grid.Column computer={3} only='computer'>
          <VideoHelp />
        </Grid.Column>
      </Grid>
    </Container>
  );
};

export default Camera;
