import moment from 'moment';
import { useEffect, useState } from 'react';
import { ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Brush, AreaChart, Area } from 'recharts';
import { Checkbox, Dropdown, Grid, Header, Menu } from 'semantic-ui-react';
import { useGetTempLogQuery } from '../../../graphql/generated/dist';

function formatXAxis(tickItem: string, t: any) {
  return moment(tickItem).format('HH:mm:ss');
}
function formatTooltip(value: number, name: string, props: string) {
  return ['°C CPU Temperature', value];
}
const options = [
  { key: 1, text: '5 min', value: 5 },
  { key: 2, text: '15 min', value: 15 },
  { key: 3, text: '30 min', value: 30 },
  { key: 4, text: '45 min', value: 45 },
  { key: 5, text: '60 min', value: 60 }
];

const TemperatureChart = () => {
  const [temp, setTemp] = useState<any>([]);
  const [minutes, setMinutes] = useState<any>(5);
  const {
    data: { getTempLog = {} } = {},
    loading,
    startPolling,
    stopPolling
  } = useGetTempLogQuery({
    variables: {
      properties: {
        //@ts-ignore
        minutes
      }
    }
  });

  useEffect(() => {
    if (!getTempLog.file) return;
    setTemp(getTempLog.file);
  }, [getTempLog]);

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
      <Header textAlign='center' subheader='Last 5min' as='h3' content='Core Temperature' />
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
          <CartesianGrid vertical={false} />
          <XAxis dataKey='timestamp' tickFormatter={formatXAxis} />
          <YAxis dataKey='message' unit='°C' domain={[0, 90]} />
          <Tooltip formatter={formatTooltip} />
          {/* <Tooltip
            wrapperStyle={{
              borderColor: 'white',
              boxShadow: '2px 2px 3px 0px rgb(204, 204, 204)'
            }}
            contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
            labelStyle={{ fontWeight: 'bold', color: '#666666' }}
          /> */}
          <Area type='monotone' dataKey='message' stroke='#82ca9d' fill='#073b1391' dot={false} />
          {/* <Line dataKey='message' stroke='#073b1391' dot={false} /> */}
          <Brush dataKey='message' stroke='#8884d8'>
            <AreaChart>
              <CartesianGrid />
              <YAxis hide domain={['auto', 'auto']} />
              <Area type='monotone' dataKey='message' stroke='#8884d8' fill='#8884d8' dot={false} />
            </AreaChart>
          </Brush>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TemperatureChart;
