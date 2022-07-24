import classnames from 'classnames';
import React, { useEffect, useState } from 'react';
import { Grid, Header } from 'semantic-ui-react';
import WebPortInput from '../components/inputWebPort';

const Application = () => {
  const [DarkTheme, setDarkTheme] = useState(false);

  useEffect(() => {
    const theme = window.localStorage.getItem('Theme');
    setDarkTheme(theme === 'dark');
  }, []);

  const toggleTheme = (e: React.ChangeEvent<HTMLInputElement>) => {
    const theme = e.currentTarget.checked === true ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', theme);
    window.localStorage.setItem('Theme', theme);
    setDarkTheme(e.target.checked);
  };

  const themeClass = classnames({
    'switch-label': true,
    'switch-green': DarkTheme
  });

  return (
    <Grid stackable padded columns={2}>
      <Grid.Column>
        <Header content='Dark Theme' />
      </Grid.Column>
      <Grid.Column computer={8} mobile={16}>
        <label className='switch switch-text'>
          <input name='dark_mode' type='checkbox' checked={DarkTheme} className='switch-input' onChange={toggleTheme} />
          <span className={themeClass} data-on='On' data-off='Off' />
          <span className='switch-handle' />
        </label>
      </Grid.Column>
      <WebPortInput />
    </Grid>
  );
};

export default Application;
