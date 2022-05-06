import React, { useEffect } from 'react';
import { Label } from 'semantic-ui-react';
import { useGetDockerLogMutation } from '../../../graphql/generated/dist';

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
    <div className='themeBg themeText'>
      {data?.getDockerLog.file?.map((log: any, idx: number) => {
        return (
          <div style={{ fontSize: '16px' }} key={idx}>
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

export default DockerLog;
