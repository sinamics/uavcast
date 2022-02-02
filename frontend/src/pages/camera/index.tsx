import { useSubscription } from '@apollo/client';
import { Card, Container, Grid, Header } from 'semantic-ui-react';
import RaspberryConsole from '../../components/CodeMirror';
import { Camera_StdoutDocument, useCameraDataQuery } from '../../graphql/generated/dist';
import VideoHelp from './components/help';
import BitratePrSecond from './containers/bitratePrSecond';
import CameraType from './containers/cameraType';
import CameraFooter from './containers/footer';
import FramesPrSecond from './containers/framesPrSecond';
import CameraProtocol from './containers/protocol';
import CameraResolution from './containers/resolution';
import CameraRotation from './containers/rotation';
import CameraContrast from './containers/contrast';
import CameraFlip from './containers/flip';
import CameraBrightness from './containers/brightness';

const Camera = () => {
  const { data: { stdout = { message: '', errors: {} } } = {} } = useSubscription(Camera_StdoutDocument);
  const { data: { cameraData = {} } = {} }: any = useCameraDataQuery();

  const { protocol } = cameraData?.database || {};
  return (
    <Container fluid>
      <Grid stackable padded columns={2} divided>
        <Grid.Column computer={13} mobile={16}>
          <Card fluid className='theme'>
            <Card.Content className='cardHeader'>
              <Grid.Column width={8}>
                <Header as='h4' content='Camera' subheader='gstreamer configuration' />
              </Grid.Column>
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
                  <CameraRotation />

                  {/* Contrast */}
                  <CameraContrast />

                  {/* Brightness*/}
                  <CameraBrightness />
                </>
              )}

              {/* Footer  */}
              <CameraFooter />
              <Grid padded columns={1}>
                <Grid.Column style={{ height: '300px' }}>
                  <RaspberryConsole stdout={stdout.message} error={stdout.errors} />
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
