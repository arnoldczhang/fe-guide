import React from 'react';
import { render } from 'react-dom';
import {
  Provider,
} from 'mobx-react';
import {
  observable,
} from 'mobx';

import App from './app/main.jsx';
import stores from './stores';

console.log(121221);
render(
  <Provider store={observable(stores)}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
