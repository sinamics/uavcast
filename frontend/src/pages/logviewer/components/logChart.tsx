import { useEffect, useRef } from 'react';
import c3 from 'c3';
import 'c3/c3.css';

const LogChart = ({ logFileData }: any) => {
  const chart = useRef<any>();

  useEffect((): any => {
    chart.current = c3.generate({
      bindto: '#myChart',
      data: {
        x: 'datetime',
        json: [],
        names: {
          altitude: 'Altitude',
          satellites: 'Sat Count',
          cellSignal: 'Cell Signal'
        },
        type: 'spline' //or line
      },
      spline: {
        interpolation: {
          type: 'linear'
        }
      },
      point: {
        show: false
      },
      axis: {
        x: {
          label: {
            text: 'Time',
            position: 'outer-center'
          },
          type: 'timeseries',
          tick: {
            format: '%d.%m %M:%S'
          }
        }
      },
      zoom: {
        enabled: true
        // initialRange: [1, 2],
        // onzoomstart: function (event) {
        //   // console.log('onzoomstart', event);
        // },
        // onzoom: function (domain) {
        //   // console.log('onzoom', domain);
        // },
        // onzoomend: function (domain) {
        //   // console.log('onzoomend', domain);
        // },
      },

      transition: {
        duration: 0
      },
      line: {
        // For enable null values in series (gaps in charts))
        connectNull: false
      }
    });
  }, []);

  useEffect(() => {
    let displayData = [];
    displayData = JSON.parse(logFileData?.getFileData?.data || '[]');

    const value = displayData.reduce((acc: any, data: any) => {
      return (acc = Object.keys(data));
    }, []);

    chart.current &&
      chart?.current.load({
        json: displayData,
        keys: {
          value
        }
      });
  }, [logFileData]);

  return <div id='myChart' className='themeText' />;
};

export default LogChart;
