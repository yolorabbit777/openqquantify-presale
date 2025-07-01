import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import { ViewportProvider } from 'contexts/viewport/viewportContext'
import { StatisticsProvider } from 'contexts/statistics/statisticsContext';

import { GRAPHQL_ENDPOINT } from 'constants';
import './createWeb3Modal'

const client = new ApolloClient({
  uri: GRAPHQL_ENDPOINT,
  cache: new InMemoryCache()
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <ViewportProvider>
        <StatisticsProvider>
          <App />
        </StatisticsProvider>
      </ViewportProvider>
    </ApolloProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
