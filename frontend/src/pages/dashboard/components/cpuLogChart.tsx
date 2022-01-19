import moment from 'moment';
import { useEffect, useState } from 'react';
import { ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Brush, AreaChart, Area } from 'recharts';
import { Checkbox, Dropdown, Grid, Header, Menu } from 'semantic-ui-react';
import { useGetCpuLogQuery } from '../../../graphql/generated/dist';

function formatXAxis(tickItem: string) {
  return moment(tickItem).format('HH:mm:ss');
}

function formatYAxis(tickItem: string) {
  if (!tickItem) return '';
  return parseFloat(tickItem).toFixed(2);
}
function formatTooltip(tooltip: string) {
  return ['% - Cpu Load', formatYAxis(tooltip)];
}

const options = [
  { key: 1, text: '5 min', value: 5 },
  { key: 2, text: '15 min', value: 15 },
  { key: 3, text: '30 min', value: 30 },
  { key: 4, text: '45 min', value: 45 },
  { key: 5, text: '60 min', value: 60 }
];
const CpuChart = () => {
  const [temp, setTemp] = useState<any>([]);
  const [minutes, setMinutes] = useState<any>(5);

  const {
    data: { getCpuLog = {} } = {},
    loading,
    startPolling,
    stopPolling
  } = useGetCpuLogQuery({
    variables: {
      properties: {
        minutes
      }
    }
  });

  useEffect(() => {
    if (!getCpuLog.file) return;
    setTemp(getCpuLog.file);
  }, [getCpuLog]);

  const liveUpdate = (e: any, value: any) => {
    if (value.checked) return startPolling(5000);

    return stopPolling();
  };
  const dropdownHandler = (_: any, { value }: any) => {
    setMinutes(value);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <Header textAlign='center' content='CPU %' subheader='Last 5min' as='h3' />
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
          <YAxis unit=' %' dataKey='message' tickFormatter={formatYAxis} type='number' domain={[0, 100]} />

          <Tooltip formatter={formatTooltip} />
          <Area type='step' dataKey='message' stroke='#82ca9d' fill='#073b1391' />
          <Brush dataKey='message' stroke='#8884d8'>
            <AreaChart>
              <CartesianGrid />
              <YAxis hide domain={[0, 100]} />
              <Area dataKey='message' stroke='#8884d8' fill='#8884d8' />
            </AreaChart>
          </Brush>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CpuChart;
