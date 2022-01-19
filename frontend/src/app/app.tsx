import React, { Suspense, useEffect } from 'react';
import { withRouter } from 'react-router';
import Spinner from '../components/spinner';
import Routes from './routes';

// AUTH
import './style.css';

const App: React.FC = (props: any): JSX.Element => {
  useEffect(() => {
    // Load theme
    document.documentElement.setAttribute('data-theme', window.localStorage.getItem('Theme') || '');
  }, []);

  return (
    <Suspense fallback={<Spinner />}>
      <Routes {...props} />
    </Suspense>
  );
};

export default withRouter(App);
