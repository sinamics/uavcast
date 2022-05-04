/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Button, Card, Grid, Header, Icon, Label, Message } from 'semantic-ui-react';
import { useGetUavcastInformationQuery } from '../../../graphql/generated/dist';
import UpdateRollbackModal from '../components/updateRestoreUavcastModal';

const Uavcast = () => {
  const [modal, setModal] = useState<boolean>();

  const { data: versionInformation, loading: versionLoading } = useGetUavcastInformationQuery();
  // const { data: { WSsupervisor } = { errors: [] } } = useSubscription(SupervisorDocument);

  // useEffect(() => {
  //   if (!WSsupervisor) return;
  //   setSupervisorText((prev) => prev.concat(WSsupervisor.message));
  // }, [WSsupervisor]);

  const updateRestoreModal = () => {
    setModal((prev) => !prev);
  };

  const externalRoute = (route: string) => {
    window.open(route, '_blank');
  };
  const { message, errors } = versionInformation?.getUavcastInformation || {};

  return (
    <>
      <UpdateRollbackModal open={modal} close={updateRestoreModal} />
      <Card fluid className='theme'>
        <Card.Content className='cardHeader themeText'>
          <Grid.Column width={8}>
            <Header as='h4' content='uavcast' subheader='Update or restore application' />
          </Grid.Column>
        </Card.Content>

        {!versionLoading && errors?.length ? (
          <Card.Content>
            <Grid stackable padded columns={1}>
              <Grid.Column>
                <Message
                  className='theme'
                  icon='warning sign'
                  size='tiny'
                  color='red'
                  header='There was some errors with uavcast'
                  list={errors?.map((err) => err.message)}
                />
              </Grid.Column>
            </Grid>
          </Card.Content>
        ) : null}
        <Card.Content>
          <Grid padded columns={1} textAlign='center'>
            <Grid.Column>
              <Header content='uavcast' subheader='Main application' />
            </Grid.Column>
          </Grid>

          <Grid stackable padded columns={2}>
            <Grid.Column>
              <Header
                content='Version'
                subheader={
                  versionLoading ? 'Loading...' : !message?.uavcast?.isRunning ? 'No Data...' : message?.uavcast?.localVersion
                }
              />
            </Grid.Column>
            <Grid.Column>
              {message && message?.uavcast?.isRunning && !message?.uavcast?.hasLatest && (
                <Label className='theme' basic color='orange' pointing='left'>
                  {`New Version ${message?.uavcast?.remoteVersion}`}
                </Label>
              )}
            </Grid.Column>
          </Grid>
          <Grid stackable padded columns={1}>
            <Grid.Column>
              <Header
                content='Latest Version'
                subheader={
                  versionLoading ? 'Loading...' : !message?.uavcast?.isRunning ? 'No Data...' : message?.uavcast?.remoteVersion
                }
              />
            </Grid.Column>
          </Grid>
        </Card.Content>

        <Card.Content extra>
          <Button
            size='small'
            // disabled={!message?.uavcast?.isRunning}
            onClick={updateRestoreModal}
            compact
            // basic
            positive
            icon
          >
            <Icon name='windows' /> UPDATE OR RESTORE
          </Button>
          <Button
            size='small'
            onClick={() => externalRoute('https://github.com/sinamics/uavcast/releases')}
            compact
            floated='right'
            // basic
            color='grey'
          >
            <Icon name='sticky note outline' />
            RELEASE NOTES
          </Button>
        </Card.Content>
      </Card>
    </>
  );
};
export default Uavcast;
