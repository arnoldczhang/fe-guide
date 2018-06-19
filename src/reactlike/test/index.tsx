import React from '../src/react';
import { Provider } from './provider';

React.hydrate(
  <Provider store={{a: 1, b: 2}}>
    <div id="a">aaaa</div>
  </Provider>,
  document.getElementById('root'),
);