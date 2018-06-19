import * as React from 'react';
// import React, { hydrate } from '../src/react';
import { Provider } from 'react-redux';
// import { Provider } from './provider';

console.log(11);

React.hydrate(
  <Provider store={{a: 1, b: 2}}>
    <div id="a">aaaa</div>
  </Provider>,
  document.getElementById('root'),
);