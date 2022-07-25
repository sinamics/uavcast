// import { useState } from 'react';
import classnames from 'classnames';
import { Grid, Header } from 'semantic-ui-react';
import { useGetLoggerParametersQuery, useSetLoggerParametersMutation } from '../../../graphql/generated/dist';

const LoggerDebug = () => {
  //   const [debugs, setDebug] = useState(false);
  const { data: { getLoggerParameters } = {}, loading: fetchLoading } = useGetLoggerParametersQuery();
  const [setLoggerParameters] = useSetLoggerParametersMutation();
  const inputHandler = (e: any) => {
    setLoggerParameters({ variables: { parameters: { debug: e.target.checked } } });
  };

  const { debug }: any = getLoggerParameters?.logs || {};
  if (fetchLoading) return <div>Loading...</div>;

  const themeClass = classnames({
    'switch-label': true,
    'switch-green': debug
    // 'switch-grey': true
  });
  return (
    <>
      <Grid stackable padded columns={2}>
        <Grid.Column width={11}>
          <Header
            content='Debug'
            // add debug text here
            subheader='This will add more verbose output in the console for each page.
                      Usefull whe troubleshooting an issue.'
          />
        </Grid.Column>
        <Grid.Column width={5}>
          <label className='switch switch-text'>
            <input name='logDebug' type='checkbox' className='switch-input' checked={debug} onChange={inputHandler} />
            <span className={themeClass} data-on='On' data-off='Off' />
            <span className='switch-handle' />
          </label>
        </Grid.Column>
      </Grid>
    </>
  );
};

export default LoggerDebug;
