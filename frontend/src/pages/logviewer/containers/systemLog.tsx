import React from 'react';
import { Label } from 'semantic-ui-react';
import { useGetServerLogQuery } from '../../../graphql/generated/dist';
//@ts-ignore
import ScrollToBottom from 'react-scroll-to-bottom';

const SystemLog = () => {
  //get server logs
  const {
    data: { getServerLog = { file: [] } } = {},
    loading,
    error
  } = useGetServerLogQuery({
    variables: { properties: { minutes: 240 } },
    fetchPolicy: 'network-only'
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;

  return (
    <ScrollToBottom>
      <div className='themeBg themeText logContainer'>
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
    </ScrollToBottom>
  );
};

export default SystemLog;
