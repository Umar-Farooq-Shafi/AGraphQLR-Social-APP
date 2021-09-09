import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import {setContext} from '@apollo/client/link/context'

import './index.css';
import App from './App';

const token = localStorage.token;
const setAuthLink = setContext(() => ({
  headers: {Authorization: token ? `Bearer ${token}` : ''}
}));

const link = createHttpLink({
  uri: 'http://localhost:5000/graphql'
});

const client = new ApolloClient({
  link: setAuthLink.concat(link),
  cache: new InMemoryCache()
});


ReactDOM.render(
  <ApolloProvider client={client}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ApolloProvider>,
  document.getElementById('root')
);
