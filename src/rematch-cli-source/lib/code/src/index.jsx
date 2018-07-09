import React from 'react';
import { hydrate } from 'react-dom';
import { Provider } from 'react-redux';

import './index.css';
import App from './app/App.jsx';
import store from './store';

hydrate(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
