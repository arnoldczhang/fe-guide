import React from 'react';
import { hydrate } from 'react-dom';
import { Provider } from 'react-redux';

import './index.css';
import App from './app/App';
import store from './store';

console.log('start');

hydrate(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
