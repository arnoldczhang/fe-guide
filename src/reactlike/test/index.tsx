// import * as React from 'react';
import React, { hydrate } from '../src/react';
// import { Provider } from 'react-redux';
import { Provider } from './provider';
console.log(1);
hydrate(
  <Provider store={{a: 1, b: 2}} data-aa="abc">
    <div id="a">aaaa</div>
    <div class="b">bbbb</div>
  </Provider>,
  document.getElementById('root'),
);