/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import LogChart from '../components/logChart';
import {
  GetFileNamesDocument,
  useGetFileDataLazyQuery,
  useGetFileNamesQuery,
  useGetLoggerParametersQuery,
  useRemoveAllLogfilesMutation,
  // useGetLoggDataQuery,
  useRemoveLogfileMutation,
  useSetLoggerParametersMutation
} from '../../../graphql/generated/dist';
import axios from 'axios';
import { Button, Checkbox, Container, Dropdown, Grid, Header, Icon, Loader } from 'semantic-ui-react';
import Spinner from '../../../components/spinner';
import { graphUrl } from '../../../utils/apolloClient';

// interface IParams {
//   checked: boolean;
//   name: string;
//   cellSignal: boolean;
//   satellites: boolean;
//   altitude: boolean;
// }
const UlogViewer = () => {
  const [viewFile, setViewFile] = useState<any>(null);
  const [saveLogParam, { loading: saveParamLoading }] = useSetLoggerParametersMutation();
  const [removeAllFiles, { loading: sysLoading }] = useRemoveAllLogfilesMutation({
    refetchQueries: [{ query: GetFileNamesDocument }]
  });

  const { data: logParameters } = useGetLoggerParametersQuery({
    fetchPolicy: 'network-only'
  });
  // const { data: { getLoggData = [] } = [], loading }: any = useGetLoggDataQuery();
  const { data: { getFileNames = {} } = {}, refetch: reFetchFiles } = useGetFileNamesQuery({
    fetchPolicy: 'network-only'
  });
  const [removeLogFile] = useRemoveLogfileMutation({
    refetchQueries: [{ query: GetFileNamesDocument }]
  });

  const [loadLogFile, { data: logFileData, loading: loadingChartData }] = useGetFileDataLazyQuery({
    fetchPolicy: 'network-only'
  });

  const viewLogFile = (file: string) => {
    loadLogFile({ variables: { filename: file } });
    setViewFile(file);
  };
  const logParamHandler = (_: any, target: any) => {
    const parameters: any = { [target.name]: target.checked };
    saveLogParam({ variables: { parameters } });
  };
  const logDropDownHandler = (_: any, target: any) => {
    const parameters: any = { [target.name]: target.value };
    saveLogParam({ variables: { parameters } });
  };
  const downloadLogFile = () => {
    const config = { headers: { 'Content-Type': 'application/json', responseType: 'blob' } };

    axios
      .post(
        `http://${graphUrl}/api/downloadLogFile`,
        {
          fileName: viewFile,
          folder: '/ulog'
        },
        config
      )
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([JSON.stringify(response.data, null, 2)]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', viewFile);
        document.body.appendChild(link);
        link.click();
      });
    // .catch((err) => console.log(err));
  };
  const { cellSignal, altitude, satellites, resolution }: any = logParameters?.getLoggerParameters?.logs || {};

  return (
    <Grid stackable columns={2} divided>
      <Grid.Column computer={3} mobile={16}>
        <Grid padded columns={2}>
          <Grid.Column computer={12}>
            <Header as='h3' content='Logfiles' subheader='All available logfiles listed bellow' />
          </Grid.Column>
          <Grid.Column computer={4}>
            <Icon style={{ cursor: 'pointer' }} className='float-right themeText' name='refresh' onClick={() => reFetchFiles()} />
          </Grid.Column>
        </Grid>
        <div style={{ height: '85vh', overflowY: 'auto', paddingRight: 0 }}>
          {getFileNames?.files?.map((file: string, i: number) => {
            return (
              <Button
                color={viewFile === file ? 'olive' : 'brown'}
                className='mb-2'
                basic
                compact
                key={i}
                onClick={() => viewLogFile(file)}
              >
                {file}
              </Button>
            );
          })}
        </div>
      </Grid.Column>
      <Grid.Column computer={13}>
        <Grid padded columns={4}>
          <Grid.Column computer={12}>
            <Header as='h3' content='Logviewer' subheader={`${viewFile}`} />
          </Grid.Column>
          <Grid.Column floated='right' computer={4}>
            <Button color='orange' disabled={!viewFile} onClick={() => downloadLogFile()} size='mini' basic>
              <Icon name='download' />
              Download File
            </Button>
            <Button
              size='mini'
              basic
              color='orange'
              disabled={!viewFile}
              onClick={() => removeLogFile({ variables: { filename: viewFile } }).then(() => setViewFile(null))}
            >
              <Icon name='trash alternate' />
              Delete Log
            </Button>
          </Grid.Column>
          <Grid.Column floated='right' computer={16}>
            {loadingChartData ? <Loader active inline='centered' /> : <LogChart logFileData={logFileData} />}
          </Grid.Column>
          <Grid.Column floated='right' computer={16}>
            <Header
              as='h3'
              content='Information'
              subheader='New logfile is generated for each time your Flight Controller has Armed status.'
            />
          </Grid.Column>
          <Grid.Column computer={4}>
            <Header as='h4' content='Parameters' />
            {saveParamLoading && <Spinner size='tiny' />}
            <div className='d-flex flex-column'>
              <Checkbox
                checked={cellSignal}
                name='cellSignal'
                onChange={logParamHandler}
                label={<label className='themeText'>Cell Signal</label>}
              />
              <Checkbox
                checked={satellites}
                name='satellites'
                onChange={logParamHandler}
                label={<label className='themeText'>Satellites</label>}
              />
              <Checkbox
                checked={altitude}
                name='altitude'
                onChange={logParamHandler}
                label={<label className='themeText'>Altitude</label>}
              />
            </div>
          </Grid.Column>
          <Grid.Column computer={4}>
            <Header as='h4' content='Settings' subheader='Log resolution.' />
            <Dropdown
              name='resolution'
              onChange={logDropDownHandler}
              placeholder='Resolution'
              className={`icon border border-success`}
              icon={'paper plane outline'}
              value={resolution}
              loading={saveParamLoading}
              labeled
              fluid
              button
              options={[
                { key: '1', text: '1 Hz', value: 1.0 },
                { key: '2', text: '1.5 Hz', value: 1.5 },
                { key: '3', text: '2 Hz', value: 2.0 },
                { key: '4', text: '2.5 Hz', value: 2.5 },
                { key: '5', text: '3 Hz', value: 3.0 }
              ]}
            />
          </Grid.Column>
          <Grid.Column computer={4}>
            <Header as='h4' content='Actions' subheader='Choose an action to execute' />
            <Button loading={sysLoading} onClick={() => removeAllFiles()} fluid color='orange' basic compact size='tiny'>
              <Icon name='trash alternate' />
              Remove all logfiles
            </Button>
          </Grid.Column>
        </Grid>
      </Grid.Column>
    </Grid>
  );
};

export default UlogViewer;
