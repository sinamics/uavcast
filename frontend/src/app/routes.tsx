/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';

import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';

// Public Views
import PageNotFound from '../pages/pageNotFound';
import Camera from '../pages/camera';

// AUTH
import { LayoutAnonymous, LayoutPublic } from './layouts';
import PublicRoute from './publicRoute';

const Map = React.lazy(() => import('../pages/map'));
const Endpoints = React.lazy(() => import('../pages/endpoints'));
const Dashboard = React.lazy(() => import('../pages/dashboard'));
const FlightController = React.lazy(() => import('../pages/flightController'));
const Modem = React.lazy(() => import('../pages/modem'));
const LogViewer = React.lazy(() => import('../pages/logviewer'));
const Settings = React.lazy(() => import('../pages/settings'));
const VpnController = React.lazy(() => import('../pages/vpn'));
const Backup = React.lazy(() => import('../pages/backup'));
const Logs = React.lazy(() => import('../pages/logs'));

const publicRoutes = [
  {
    key: 'dash',
    path: '/',
    component: Dashboard,
    exact: true
  },
  {
    key: 'dashboard',
    path: '/dashboard',
    component: Dashboard,
    exact: true
  },
  {
    key: 'map',
    path: '/map',
    component: Map,
    exact: true
  },
  {
    key: 'flightcontroller',
    path: '/flightcontroller',
    component: FlightController,
    exact: true
  },
  {
    key: 'groundcontroller',
    path: '/groundcontroller',
    component: Endpoints,
    exact: true
  },
  {
    key: 'modem',
    path: '/modem',
    component: Modem,
    exact: true
  },
  {
    key: 'camera',
    path: '/camera',
    component: Camera,
    exact: true
  },
  {
    key: 'vpn',
    path: '/vpn',
    component: VpnController,
    exact: true
  },
  {
    key: 'logviewer',
    path: '/logviewer',
    component: LogViewer,
    exact: true
  },
  {
    key: 'settings',
    path: '/settings',
    component: Settings,
    exact: true
  },
  {
    key: 'backup',
    path: '/backup',
    component: Backup,
    exact: true
  },
  {
    key: 'logs',
    path: '/logs',
    component: Logs,
    exact: true
  }
];

const anonymousRoutes = [
  {
    key: 'notfound',
    path: '*',
    component: PageNotFound,
    exact: false
  }
];

const Routes: React.FC = (): JSX.Element => {
  return (
    <Router>
      <Switch>
        <Route exact path={publicRoutes.map((p: any) => p.path)}>
          <LayoutPublic>
            <Switch>
              {publicRoutes.map((publicProps, idx) => (
                <PublicRoute {...publicProps} key={idx} />
              ))}
            </Switch>
          </LayoutPublic>
        </Route>

        <Route path={anonymousRoutes.map((p: any) => p.path)}>
          <LayoutAnonymous>
            <Switch>
              {anonymousRoutes.map((anonymousRoutes, idx) => (
                <PublicRoute {...anonymousRoutes} key={idx} />
              ))}
            </Switch>
          </LayoutAnonymous>
        </Route>
      </Switch>
    </Router>
  );
};

export default Routes;
