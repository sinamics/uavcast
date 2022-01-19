import * as React from 'react';
import { Route, Redirect } from 'react-router-dom';

interface RouteProps {
  component: React.FC;
  path: string;
  exact: boolean;
}

const PublicRoute: React.FC<RouteProps> = (props): JSX.Element => {
  // If we need to validate public routes, lets do it here.  Allowing all for now.
  const valid = true;
  return valid ? <Route path={props.path} exact={props.exact} component={props.component} /> : <Redirect to='/settings' />;
};

export default PublicRoute;
