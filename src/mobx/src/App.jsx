import React from 'react';
import { render } from 'react-dom';
import App from './app/index.jsx';
import {
  Provider,
} from 'mobx-react';
import {
  observable,
} from 'mobx';

const store = observable({
  color: ['red'],
});

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
