/* eslint-disable no-unused-vars */
import { useSubscription } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { Button, Dropdown, Grid, Header, Icon, List, Message, Modal } from 'semantic-ui-react';
import RaspberryConsole from '../../../components/CodeMirror';
//@ts-ignore
import ScrollToBottom from 'react-scroll-to-bottom';
import {
  SupervisorDocument,
  useUpdateSupervisorContainerMutation,
  useGetAvailableVersionsQuery
} from '../../../graphql/generated/dist';

const UpdateRollbackSupervisorModal = ({ open, close }: any) => {
  const [version, setVersion] = useState<any>([]);
  const [selectedVersion, setSelectedVersion] = useState<any>(null);
  const [supervisorText, setSupervisorText] = useState<string>('');
  const [errors, setErrors] = useState<any>([]);

  const { data: { supervisor: WSsupervisor } = { errors: [] } } = useSubscription(SupervisorDocument);
  const [getNewVersion] = useUpdateSupervisorContainerMutation();
  const { data: availVersion } = useGetAvailableVersionsQuery({
    variables: { application: 'supervisor' },
    fetchPolicy: 'network-only'
  });

  useEffect(() => {
    if (availVersion?.getAvailableVersions.count) {
      setVersion([]);
      availVersion?.getAvailableVersions.results.map((value) => {
        setVersion((prev: any) => [
          ...prev,
          {
            key: value.id,
            text: `${value.name} (${Math.floor(parseInt(value.full_size, 10) / 1024 / 1024).toFixed(1)} Mb)`,
            value: value.name
          }
        ]);
        return true;
      });
    }
  }, [availVersion]);

  useEffect(() => {
    if (!WSsupervisor) return;
    setSupervisorText((prev: any) => prev.concat(WSsupervisor.message));
  }, [WSsupervisor]);

  const selectVersion = (_: any, target: any) => {
    setSelectedVersion(target.value);
  };
  const downloadNewContainer = () => {
    if (!selectedVersion) return;
    getNewVersion({ variables: { version: selectedVersion } }).then(({ data }) => {
      if (data && data.updateSupervisorContainer.errors?.length) {
        setErrors(data.updateSupervisorContainer.errors);
      }
    });
  };

  return (
    <Modal
      //   basic
      centered
      onClose={() => close()}
      //   onOpen={() => setOpen(true)}
      open={open}
      size='small'
      className='themeBg'
    >
      <Header icon className='themeBg theme'>
        <Icon name='cloud download' />
        Update or Rollback Supervisor
      </Header>
      <Modal.Content className='themeBg themeText'>
        <List bulleted>
          <List.Item>Settings and configuration will be maintained when updating application</List.Item>
          <List.Item>You can at anytime downgrade to any version</List.Item>
          <List.Item>Update will download large amount of data, make sure you are not using LTE modem</List.Item>
        </List>
      </Modal.Content>
      <Modal.Content className='themeBg'>
        <Grid stackable padded columns={2}>
          <Grid.Column>
            <Header content='Select version' subheader='Choose a version you want to install' />
          </Grid.Column>
          <Grid.Column textAlign='right'>
            <Dropdown
              button
              floating
              labeled
              fluid
              className='icon border border-success'
              onChange={selectVersion}
              placeholder='Versions'
              selection
              options={version}
              icon={'paper plane outline'}
            />
          </Grid.Column>
        </Grid>
        <Grid stackable padded columns={1}>
          <Grid.Column>
            {selectedVersion ? (
              <Button color='orange' fluid onClick={downloadNewContainer}>
                <Icon name='cloud download' /> DOWNLOAD & UPDATE
              </Button>
            ) : null}
          </Grid.Column>
        </Grid>
        <Grid stackable padded columns={1}>
          <Grid.Column>{errors.length ? <Message error list={errors.map((e: any) => e.message)} /> : null}</Grid.Column>
        </Grid>
        <Grid stackable padded columns={1}>
          <Grid.Column>
            <ScrollToBottom>
              <div style={{ maxHeight: '500px' }}>
                <RaspberryConsole stdout={supervisorText} placeholder='Update / Rollback status window' defaultLines={3} />
              </div>
            </ScrollToBottom>
          </Grid.Column>
        </Grid>
      </Modal.Content>

      <Modal.Actions className='themeBg'>
        <Button basic color='orange' onClick={() => close()}>
          <Icon name='remove' /> Close
        </Button>
        {/* <Button color='green' inverted onClick={() => close()}>
          <Icon name='checkmark' /> Yes
        </Button> */}
      </Modal.Actions>
    </Modal>
  );
};

export default UpdateRollbackSupervisorModal;
