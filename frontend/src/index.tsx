import ReactDOM from 'react-dom';
// import i18n (needs to be bundled ;))
import App from './app/app';
// import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { client } from './utils/apolloClient';
import ReactGA from 'react-ga';

import './translations/i18next';

// Import Main styles for this application
import './scss/style.scss';

if (process.env.NODE_ENV === 'production') {
  ReactGA.initialize('UA-107582726-2', {
    debug: false,
    titleCase: true
  });
}

ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
