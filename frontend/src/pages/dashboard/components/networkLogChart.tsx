import moment from 'moment';
import { useEffect, useState } from 'react';
import { ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Brush, AreaChart, Area } from 'recharts';
import { Checkbox, Dropdown, Grid, Header, Menu } from 'semantic-ui-react';
import { useGetNetworkLogQuery } from '../../../graphql/generated/dist';

function formatXAxis(tickItem: string) {
  return moment(tickItem).format('HH:mm:ss');
}

function formatYAxis(tickItem: number) {
  const marker = 1024; // Change to 1000 if required
  const decimal = 2; // Change as required
  // console.log(tickItem);
  const megaBytes = marker * marker; // One MB is 1024 KB
  return (tickItem / megaBytes).toFixed(decimal);
}

function formatTooltip(value: number, name: string, props: string) {
  if (name.includes('tx')) return ['MB/s - Transmitted Data', formatYAxis(value)];
  return ['MB/s - Recevied Data', formatYAxis(value)];
}
const options = [
  { key: 1, text: '5 min', value: 5 },
  { key: 2, text: '15 min', value: 15 },
  { key: 3, text: '30 min', value: 30 },
  { key: 4, text: '45 min', value: 45 },
  { key: 5, text: '60 min', value: 60 }
];
const NetworkChart = () => {
  const [temp, setTemp] = useState<any>([]);
  const [minutes, setMinutes] = useState<any>(5);

  const {
    data: { getNetworkLog = {} } = {},
    loading,
    startPolling,
    stopPolling
  } = useGetNetworkLogQuery({
    variables: {
      properties: {
        //@ts-ignore
        minutes
      }
    }
  });

  useEffect(() => {
    if (!getNetworkLog.file) return;
    setTemp(getNetworkLog.file);
  }, [getNetworkLog]);

  const liveUpdate = (e: any, value: any) => {
    if (value.checked) return startPolling(5000);

    return stopPolling();
  };
  const dropdownHandler = (_: any, { value }: any) => {
    setMinutes(value);
  };
  if (loading) return <div>Loading...</div>;
  // console.log(getNetworkLog);
  return (
    <div>
      <Header textAlign='center' content='Network Stats' subheader='Last 5min' as='h3' />
      <Grid>
        <Grid.Row columns={2}>
          <div className='container d-flex justify-content-between w-100 align-items-center'>
            <Grid.Column>
              <Menu className='themeBg' size='mini' compact>
                <Dropdown value={minutes} onChange={dropdownHandler} options={options} simple item />
              </Menu>
            </Grid.Column>

            <Grid.Column>
              <Checkbox label='Live' onChange={liveUpdate} />
            </Grid.Column>
          </div>
        </Grid.Row>
      </Grid>
      <ResponsiveContainer width='100%' aspect={4.0 / 2.0}>
        <AreaChart data={temp} margin={{ top: 5, right: 40, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='timestamp' tickFormatter={formatXAxis} />
          <YAxis unit=' MB/s' tickFormatter={formatYAxis} domain={[0, 'dataMax + 10000']} />
          {/* <YAxis dataKey='message[0].tx_sec' unit=' MB/s' tickFormatter={formatYAxis} domain={[0, 'dataMax']} /> */}

          <Tooltip formatter={formatTooltip} />
          <Area type='monotone' dataKey='message[0].rx_sec' stroke='#8884d8' fill='#8884d8' dot={false} />
          <Area type='monotone' dataKey='message[0].tx_sec' stroke='#82ca9d' fill='#073b1391' dot={false} />

          <Area type='monotone' dataKey='message[1].rx_sec' stroke='#ffc658' fill='#ffc658' dot={false} />
          <Area type='monotone' dataKey='message[1].tx_sec' stroke='#5898ff' fill='#5898ff' dot={false} />
          <Brush dataKey='message[0].tx_sec' stroke='#8884d8'>
            <AreaChart>
              <CartesianGrid />
              <YAxis hide domain={['auto', 'auto']} />
              <Area dataKey='message[0].rx_sec' stroke='#8884d8' fill='#8884d8' dot={false} />
              <Area dataKey='message[0].tx_sec' stroke='#82ca9d' fill='#073b1391' dot={false} />
            </AreaChart>
          </Brush>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default NetworkChart;
