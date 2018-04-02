import React from 'react';
import { hydrate } from 'react-dom';
import {
  Provider,
} from 'mobx-react';
import {
  observable,
} from 'mobx';

import App from './app/main.jsx';
import stores from './stores';

if (process.env.NODE_ENV !== 'production') {
  const { reactopt } = require('reactopt');
  reactopt(React);
}
console.log('enter');

hydrate(
  <Provider store={observable(stores)} aa="1">
    <App />
  </Provider>,
  document.getElementById('root'),
);
