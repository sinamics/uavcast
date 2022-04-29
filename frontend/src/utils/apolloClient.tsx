import { ApolloClient, InMemoryCache, split } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import { WebSocketLink } from '@apollo/client/link/ws';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { createUploadLink } from 'apollo-upload-client';

export const extractHostname = (url: string) => {
  let hostname;
  //find & remove protocol (http, ftp, etc.) and get hostname
  if (url.indexOf('://') > -1) {
    hostname = url.split('/')[2];
  } else {
    hostname = url.split('/')[0];
  }

  //find & remove port number if developing
  if (process.env.NODE_ENV === 'development') {
    hostname = hostname.split(':')[0];
  }

  //find & remove "?"
  hostname = hostname.split('?')[0];

  return `${hostname}:4000`;
};

export const graphUrl = extractHostname(window.location.href);

const errorLink = onError(({ networkError, graphQLErrors }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
    );
  }
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

export const wsClient = new SubscriptionClient(`ws://${graphUrl}/subscriptions`, {
  reconnect: true
});

const uploadLink = createUploadLink({
  uri: `http://${graphUrl}/graphql`
});
// wsClient.onConnected(() => console.log("websocket connected!!"))
// wsClient.onDisconnected(() => console.log("websocket disconnected!!"))
// wsClient.onReconnected(() => console.log("websocket reconnected!!"))
const wsLink = new WebSocketLink(wsClient);
// const httpLink = new HttpLink({
//   uri: `http://${graphUrl}/graphql`
// });

// The split function takes three parameters:
//
// * A function that's called for each operation to execute
// * The Link to use for an operation if the function returns a "truthy" value
// * The Link to use for an operation if the function returns a "falsy" value
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
  },
  wsLink,
  uploadLink
);

const link = ApolloLink.from([errorLink, splitLink as any]);

const cache = new InMemoryCache({
  addTypename: true
  // typePolicies: {
  // Query: {
  //   fields: {
  //     me: {
  //       merge(existing = [], incoming) {
  //         return { ...existing, ...incoming };
  //       },
  //     },
  //   },
  // },
  // },
});

export const client = new ApolloClient({
  link: link as any,
  cache,
  queryDeduplication: true
});
