import * as React from 'react';
// import { Provider } from 'react-redux';
// import React, { hydrate } from '../src/react';
import { Provider } from './provider';
import App from './App';
import ErrorBandary from './ErrorBandary';
import store from './store';

console.log(12);
React.hydrate(
  <Provider store={store}>
    <ErrorBandary>
      <App />
    </ErrorBandary>
  </Provider>,
  document.getElementById('root'),
)