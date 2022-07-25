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
        // check if first word is error or failed
        const errorWords = ['failed', 'error'];
        const isError = new RegExp(errorWords.join('|')).test(log?.message.toLowerCase());

        return (
          <div key={idx} style={{ fontSize: '16px' }}>
            <Label color={`${isError ? 'red' : 'green'}`} horizontal>
              {log.timestamp}
            </Label>
            <span style={{ background: `${isError ? '#a1131366' : ''}` }}>{`${log.message}`}</span>
          </div>
        );
      })}
    </div>
  );
};

export default SystemLog;
