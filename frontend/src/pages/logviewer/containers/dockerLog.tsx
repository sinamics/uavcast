import React, { useEffect } from 'react';
import { Label } from 'semantic-ui-react';
import { useGetDockerLogMutation } from '../../../graphql/generated/dist';
//@ts-ignore
import ScrollToBottom from 'react-scroll-to-bottom';

const DockerLog = () => {
  //get server logs
  const [fetchLog, { data, loading, error }] = useGetDockerLogMutation({
    variables: { properties: { minutes: 240 } },
    fetchPolicy: 'network-only'
  });

  useEffect(() => {
    fetchLog();
  }, [fetchLog]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;

  return (
    <ScrollToBottom>
      <div className='themeBg themeText logContainer'>
        {data?.getDockerLog.file?.map((log: any, idx: number) => {
          // check if first word is error or failed
          const errorWords = ['failed', 'error'];
          const isError = new RegExp(errorWords.join('|')).test(log?.message.toLowerCase());
          // const isError = new RegExp(errorWords.join('|')).test(log?.level?.toLowerCase()) || false;
          return (
            <div key={idx} style={{ fontSize: '16px' }}>
              <Label style={{ background: `${isError ? '#ff00008c' : '#21ba4570'}` }} horizontal>
                {`${log.timestamp}`}
              </Label>
              <Label style={{ background: `${isError ? '#ff00008c' : '#21ba4570'}` }} horizontal>
                {`[${isError ? 'ERROR' : log.level?.toUpperCase()}]`}
              </Label>
              <span style={{ background: `${isError ? '#a1131366' : ''}` }}>{`${log.message} : ${log.data}`}</span>
            </div>
          );
        })}
      </div>
    </ScrollToBottom>
  );
};

export default DockerLog;
