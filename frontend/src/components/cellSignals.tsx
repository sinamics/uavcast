import React from 'react';
import { Grid } from 'semantic-ui-react';

export const CellSignals: React.FC<any> = ({ modemStats }: any): JSX.Element => {
  if (!modemStats) return <div />;
  const { SignalStrength = 0, CurrentNetworkType = '', FullName = '' } = modemStats;

  switch (true) {
    case SignalStrength >= 0 && SignalStrength <= 2:
      return (
        <span>
          <Grid>
            <div className='signal-bars mt1 sizing-box none one-bar animate-flicker'>
              <span className='cell-network'>{SignalStrength > 0 && cellband(CurrentNetworkType[0])}</span>
              <div className='first-bar bar' />
              <div className='second-bar bar' />
              <div className='third-bar bar' />
              <div className='fourth-bar bar' />
              <div className='fifth-bar bar' />
            </div>
          </Grid>
          <Grid md='12 lh-0'>
            <span className='cell-vendor text-center' style={{ color: '#bcffbc' }}>
              {FullName[0]}
            </span>
          </Grid>
        </span>
      );
    case SignalStrength >= 0 && SignalStrength <= 20:
      return (
        <span>
          <Grid>
            <div className='signal-bars mt1 sizing-box bad one-bar'>
              <span className='cell-network'>{SignalStrength > 0 && cellband(CurrentNetworkType[0])}</span>
              <div className='first-bar bar' />
              <div className='second-bar bar' />
              <div className='third-bar bar' />
              <div className='fourth-bar bar' />
              <div className='fifth-bar bar' />
            </div>
          </Grid>
          <Grid md='12 lh-0'>
            <span className='cell-vendor text-center' style={{ color: '#bcffbc' }}>
              {FullName[0]}
            </span>
          </Grid>
        </span>
      );
    case SignalStrength > 20 && SignalStrength <= 40:
      return (
        <Grid padded columns={1}>
          <Grid.Column>
            <div className='signal-bars mt1 sizing-box ok two-bars'>
              <span className='cell-network'>{SignalStrength > 0 && cellband(CurrentNetworkType[0])}</span>
              <div className='first-bar bar' />
              <div className='second-bar bar' />
              <div className='third-bar bar' />
              <div className='fourth-bar bar' />
              <div className='fifth-bar bar' />
            </div>
          </Grid.Column>
          <Grid.Column>
            <span className='cell-vendor text-center' style={{ color: '#bcffbc' }}>
              {FullName[0]}
            </span>
          </Grid.Column>
        </Grid>
      );
    case SignalStrength > 40 && SignalStrength <= 60:
      return (
        <span>
          <Grid>
            <div className='signal-bars mt1 sizing-box ok three-bars'>
              <span className='cell-network'>{SignalStrength > 0 && cellband(CurrentNetworkType[0])}</span>
              <div className='first-bar bar' />
              <div className='second-bar bar' />
              <div className='third-bar bar' />
              <div className='fourth-bar bar' />
              <div className='fifth-bar bar' />
            </div>
          </Grid>
          <Grid md='12 lh-0'>
            <span className='cell-vendor text-center' style={{ color: '#bcffbc' }}>
              {FullName[0]}
            </span>
          </Grid>
        </span>
      );
    case SignalStrength > 60 && SignalStrength <= 80:
      return (
        <span>
          <Grid>
            <div className='signal-bars mt1 sizing-box good four-bars'>
              <span className='cell-network'>{SignalStrength > 0 && cellband(CurrentNetworkType[0])}</span>
              <div className='first-bar bar' />
              <div className='second-bar bar' />
              <div className='third-bar bar' />
              <div className='fourth-bar bar' />
              <div className='fifth-bar bar' />
            </div>
          </Grid>
          <Grid md='12 lh-0'>
            <span className='cell-vendor text-center' style={{ color: '#bcffbc' }}>
              {FullName[0]}
            </span>
          </Grid>
        </span>
      );
    case SignalStrength > 80 && SignalStrength <= 100:
      return (
        <span>
          <Grid>
            <div className='signal-bars mt1 sizing-box good fifth-bars'>
              <span className='cell-network'>{SignalStrength > 0 && cellband(CurrentNetworkType[0])}</span>
              <div className='first-bar bar' />
              <div className='second-bar bar' />
              <div className='third-bar bar' />
              <div className='fourth-bar bar' />
              <div className='fifth-bar bar' />
            </div>
          </Grid>
          <Grid md='12 lh-0'>
            <span className='cell-vendor text-center' style={{ color: '#bcffbc' }}>
              {FullName[0]}
            </span>
          </Grid>
        </span>
      );
    default:
      return <div />;
  }
};
export function conStatus(statusCode: number) {
  // #        900 = connecting
  // #        901 = connected
  // #        902 = disconnected
  // #        903 = disconnecting
  if (!statusCode) return;
  //   let code = parseInt(statusCode, 10);

  switch (statusCode) {
    case 900:
      return <span style={{ color: 'yellow' }}>Connecting</span>;
    case 901:
      return <span style={{ color: 'green' }}>Connected</span>;
    case 902:
      return <span style={{ color: 'red' }}>Disconnected</span>;
    case 903:
      return <span style={{ color: 'red' }}>Disconnecting</span>;

    default:
      break;
  }
}
export function cellband(strength: number) {
  switch (true) {
    case strength > 0 && strength <= 3:
      return <span>2G</span>;
    case strength > 3 && strength <= 18:
      return <span>3G</span>;
    case strength > 18 && strength <= 19:
      return <span>4G</span>;

    default:
      break;
  }
}
