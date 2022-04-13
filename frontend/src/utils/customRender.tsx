import * as React from 'react';
import { render } from '@testing-library/react';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { Router, Switch } from 'react-router-dom';
import { createMemoryHistory } from 'history';

export const customRender = (
  node: JSX.Element | null,
  mocks?: MockedResponse[],
  { route = '/', history = createMemoryHistory({ initialEntries: [route] }) } = {} as any
) => {
  return {
    history,
    ...render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Router history={history}>
          <Switch>{node}</Switch>
        </Router>
      </MockedProvider>
    )
  };
};
