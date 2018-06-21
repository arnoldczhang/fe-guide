import React from 'react';
import { hydrate } from 'react-dom';
import { Provider } from 'react-redux';

import './index.css';
import App from './app/App.js';
import store from './store';

console.log('start');

hydrate(
  <Provider store={store}>
    <App />
  </Provider>,
  // <div>
  //   {'aaa'}
  // </div>,
  document.getElementById('root'),
);
