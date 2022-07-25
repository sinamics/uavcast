import React from 'react';
import { Label } from 'semantic-ui-react';
import { useGetServerLogQuery } from '../../../graphql/generated/dist';

const SystemLog = () => {
  //get server logs
  const {
    data: { getServerLog = { file: [] } } = {},
    loading,
    error
  } = useGetServerLogQuery({
    variables: { properties: { minutes: 240, limit: 35 } },
    fetchPolicy: 'network-only'
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;

  return (
    <div className='themeBg themeText'>
      {getServerLog.file?.map((log: any, idx: number) => {
        return (
          <div key={idx} style={{ fontSize: '16px' }}>
            <Label color='blue' horizontal>
              {log.timestamp}
            </Label>
            {`${log.message}`}
          </div>
        );
      })}
    </div>
  );
};

export default SystemLog;
