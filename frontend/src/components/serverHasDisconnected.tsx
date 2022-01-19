import React, { useCallback, useEffect, useState } from 'react';
import Spinner from './spinner';
import { wsClient } from '../utils/apolloClient';
import TimeAgo from 'react-timeago';

let disconnectTimeout: any;

const ServerDisconnected = () => {
  const [disconnected, setDisconnected] = useState(false);
  const date = new Date();

  const statusHandel = useCallback((status: any) => {
    // let disconnectTimeout: ReturnType<typeof setTimeout>;
    if (status) {
      if (disconnectTimeout) return;

      return (disconnectTimeout = setTimeout(() => {
        setDisconnected(status);
      }, 6000));
    }

    clearTimeout(disconnectTimeout);
    disconnectTimeout = 0;
    setDisconnected(status);
  }, []);

  useEffect(() => {
    wsClient.onDisconnected(() => {
      // eslint-disable-next-line no-console
      console.log('disconnected from server');

      statusHandel(true);
    });

    wsClient.onReconnected(() => {
      // eslint-disable-next-line no-console
      console.log('connected to server');
      statusHandel(false);
    });

    return () => {
      wsClient.unsubscribeAll();
    };
  }, [statusHandel]);

  return (
    <React.Fragment>
      {disconnected && (
        <Spinner>
          <div className='text-danger '>RPI DISCONNECTED</div>
          <div>
            <TimeAgo date={date} />
          </div>
        </Spinner>
      )}
    </React.Fragment>
  );
};
export default ServerDisconnected;
