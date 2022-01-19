/* eslint-disable indent */
import React, { useState } from 'react';
import { Button, Card, Grid, Header, Icon, Label, Message } from 'semantic-ui-react';
import { useGetSupervisorInformationQuery } from '../../../graphql/generated/dist';
import UpdateRollbackSupervisorModal from '../components/updateRestoreSupervisorModal';

const Supervisor = () => {
  const [modal, setModal] = useState<boolean>();
  const { data: versionInformation, loading: versionLoading } = useGetSupervisorInformationQuery();

  const externalRoute = (route: string) => {
    window.open(route, '_blank');
  };
  const updateRestoreModal = () => {
    setModal((prev) => !prev);
  };

  const { message, errors } = versionInformation?.getSupervisorInformation || {};

  return (
    <>
      <UpdateRollbackSupervisorModal open={modal} close={updateRestoreModal} />
      <Card fluid className='theme'>
        <Card.Content className='cardHeader'>
          <Grid.Column width={8}>
            <Header as='h4' content='Supervisor' subheader='Update application' />
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
                  header='There was some errors with supervisor'
                  list={errors?.map((err) => err.message)}
                />
              </Grid.Column>
            </Grid>
          </Card.Content>
        ) : null}
        <Card.Content>
          <Grid padded columns={1} textAlign='center'>
            <Grid.Column>
              <Header content='Supervisor' subheader='Helper application for uavcast' />
            </Grid.Column>
          </Grid>
          <Grid stackable padded columns={2}>
            <Grid.Column>
              <Header
                content='Version'
                subheader={
                  versionLoading
                    ? 'Loading...'
                    : !message?.supervisor?.isRunning
                    ? 'No Data...'
                    : message?.supervisor?.localVersion
                }
              />
            </Grid.Column>
            <Grid.Column>
              {message && !message?.supervisor?.hasLatest && (
                <Label className='theme' basic color='orange' pointing='left'>
                  {`New Version ${message?.supervisor?.remoteVersion}`}
                </Label>
              )}
            </Grid.Column>
          </Grid>

          <Grid stackable padded columns={2}>
            <Grid.Column>
              <Header
                content='Latest Version'
                subheader={
                  versionLoading
                    ? 'Loading...'
                    : !message?.supervisor?.isRunning
                    ? 'No Data...'
                    : message?.supervisor?.remoteVersion
                }
              />
            </Grid.Column>
          </Grid>
        </Card.Content>
        <Card.Content extra>
          <Button
            size='small'
            onClick={updateRestoreModal}
            compact
            // basic
            positive
            icon
          >
            <Icon name='windows' />
            UPDATE
          </Button>
          <Button
            size='small'
            onClick={() => externalRoute('https://docs.uavmatrix.com/changelog/')}
            compact
            floated='right'
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
export default Supervisor;
