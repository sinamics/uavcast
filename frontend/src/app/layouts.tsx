import React, { Suspense, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import Header from '../components/Header/Header';
import SuspenseMainLoading from '../components/suspense2columns';
import ServerHasDisconnected from '../components/serverHasDisconnected';
import ReactGA from 'react-ga';

const Sidebar = React.lazy(() => import('../components/Sidebar/Sidebar'));

const GoogleAnalytics = (location: any) => {
  ReactGA.pageview('version ' + process.env.REACT_APP_UAVCAST_VER + location.pathname);
};
export const LayoutPublic = withRouter(({ children, location }: any): any => {
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      GoogleAnalytics(location);
    }
  }, [location]);
  return (
    <div className='app'>
      <Header />
      <div className='app-body'>
        <Sidebar />
        <main className='main'>
          <ServerHasDisconnected />
          <Suspense fallback={<SuspenseMainLoading />}>{children}</Suspense>
          {/* <SuspenseMainLoading /> */}
        </main>
        {/* <Aside /> */}
      </div>
    </div>
  );
});

export const LayoutAnonymous: React.FC<Record<string, unknown>> = (props) => {
  return <div>{props.children}</div>;
};
