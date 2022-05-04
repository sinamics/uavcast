import React, { Suspense, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import Header from '../components/Header/Header';
import SuspenseMainLoading from '../components/suspense2columns';
import ServerHasDisconnected from '../components/serverHasDisconnected';
import ReactGA from 'react-ga';
import { useGetUavcastInformationQuery } from '../graphql/generated/dist';

const Sidebar = React.lazy(() => import('../components/Sidebar/Sidebar'));

export const LayoutPublic = withRouter(({ children, location }: any): any => {
  const { data: versionInformation, loading: uavcastLoading } = useGetUavcastInformationQuery();
  const { message } = versionInformation?.getUavcastInformation || {};

  useEffect(() => {
    if (uavcastLoading) return;
    if (process.env.NODE_ENV === 'production') {
      ReactGA.pageview(message?.uavcast?.localVersion + location.pathname);
    }
  }, [message, location, uavcastLoading]);

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
