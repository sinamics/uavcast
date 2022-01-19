/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios';
import React, { useState } from 'react';
import { Button, Checkbox, Container, Dropdown, Grid, Header, Icon, Modal } from 'semantic-ui-react';
import { graphUrl } from '../../../utils/apolloClient';
import b64ToBlob from 'b64-to-blob';
import fileSaver from 'file-saver';

const options = [
  {
    key: 'last30min',
    text: 'Last 30 Minutes',
    value: 'last30min',
    default: true
  },
  {
    key: 'lastHour',
    text: 'Last Hour',
    value: 'lastHour'
  },
  {
    key: 'today',
    text: 'Today',
    value: 'today'
  },
  {
    key: 'yesterday',
    text: 'Yesterday',
    value: 'yesterday'
  },
  {
    key: 'last7days',
    text: 'Last 7 Days',
    value: 'last7days'
  },
  {
    key: 'thisMonth',
    text: 'This Month',
    value: 'thisMonth'
  }
];
function DownloadLogModal({ close }: any) {
  const [loading, setLoading] = useState<boolean>(false);
  const [periode, setPeriode] = useState<any>(options[0]);
  const [service, setService] = useState<Array<any>>(['serverLogger']);

  const downloadLogFile = () => {
    setLoading(true);
    const config = { headers: { 'Content-Type': 'application/json', responseType: 'blob' } };

    axios
      .post(
        `http://${graphUrl}/api/getLogFiles`,
        {
          periode: periode.value,
          selectedServices: service
        },
        config
      )
      .then((response) => {
        const blob = b64ToBlob(response.data, 'application/zip');
        fileSaver.saveAs(blob, `uavcast-logfile-${new Date().toLocaleDateString()}.zip`);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const serviceHandler = (e: any, d: any) => {
    if (d.checked) {
      return setService((prev: any) => [...prev, d.name]);
    }
    return setService(service.filter((x: any) => x !== d.name));
  };

  return (
    <Modal className='themeBg' closeIcon onClose={() => close(false)} open={true}>
      <Header icon='download' className='themeBg theme' content='Download' />
      <Modal.Content className='themeBg themeText'>
        <p>Select services to download</p>
        <Container>
          <Grid.Row>
            <Checkbox
              defaultChecked
              onChange={serviceHandler}
              name='serverLogger'
              label={<label className='themeText'>System logs</label>}
            />
          </Grid.Row>
          <Grid.Row>
            <Checkbox onChange={serviceHandler} name='statistics' label={<label className='themeText'>Statistics logs</label>} />
          </Grid.Row>
        </Container>
      </Modal.Content>
      <Modal.Content className='themeBg themeText'>
        <p>Select log periode you want to download</p>
        <Dropdown
          fluid
          button
          name='periode'
          className={`icon border border-success`}
          floating
          labeled
          onChange={(e, d) => setPeriode(d)}
          icon={'paper plane outline'}
          options={options}
          placeholder='Log Periode'
          defaultValue={options[0].value}
        />
      </Modal.Content>
      <Modal.Actions className='themeBg'>
        <Button onClick={() => close(false)}>
          <Icon name='remove' /> Back
        </Button>
        <Button loading={loading} disabled={!service.length || !periode?.value} color='green' onClick={() => downloadLogFile()}>
          <Icon name='download' /> Download
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

export default DownloadLogModal;
