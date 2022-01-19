import { useEffect, useState } from 'react';
import { Message } from 'semantic-ui-react';
import { useCmdAckSubscription } from '../../../graphql/generated/dist';

let ackTimeout: ReturnType<typeof setTimeout>;

const Notifications = ({ heartbeat, gps_raw_int, failsafe }: any): any => {
  const [error, setError] = useState<any>(new Set([]));
  const [ack, setAck] = useState<any>({ message: '', error: false });
  const { data: ackData } = useCmdAckSubscription();

  useEffect(() => {
    setError(new Set([]));

    if (!gps_raw_int?.lat) {
      setError((prev: any) => new Set([...prev, 'No gps signal !']));
    }
    if (heartbeat?.connected && failsafe?.gcs?.param_value === 0) {
      setError((prev: any) => new Set([...prev, 'GCS Failsafe not activated, Fly with caution!']));
    }
  }, [gps_raw_int, heartbeat, failsafe]);

  useEffect(() => {
    // https://mavlink.io/en/messages/common.html#MAV_RESULT
    switch (ackData?.cmdAck?.result) {
      case 0:
        setAck({ message: 'FC responded successfully', error: false });
        break;
      case 1:
        setAck({ message: 'Temporarily Rejected', error: true });
        break;
      case 2:
        setAck({ message: 'Command Denied', error: true });
        break;
      case 3:
        setAck({ message: 'Command Unsupported', error: true });
        break;
      case 4:
        setAck({ message: 'Command Failed!', error: true });
        break;
      case 5:
        setAck({ message: 'Command In progress!', error: true });
        break;
      case 6:
        setAck({ message: 'Command Cancelled!', error: true });
        break;
      default:
        break;
    }

    ackTimeout = setTimeout(() => {
      setAck({ message: '', error: false });
    }, 3000);

    return () => clearTimeout(ackTimeout);
  }, [ackData]);

  return (
    <span className='text-center noGpsData d-flex flex-column flex-grow justify-content-center align-items-center'>
      {ack.message ? (
        <div>
          <Message
            size='tiny'
            error={ack.error}
            success={!ack.error}
            style={{ background: '#00000071', width: 'auto' }}
            header={ack.message}
          />
        </div>
      ) : null}
      {error.size ? (
        <div>
          <Message
            icon='warning sign'
            size='large'
            negative
            style={{ background: '#00000071', width: 'auto' }}
            header='There was some errors'
            list={Array.from(error)}
          />
        </div>
      ) : null}
    </span>
  );
};

export default Notifications;
