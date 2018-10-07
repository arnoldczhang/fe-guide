import React from 'react';
import { Provider } from 'react-redux';


import './index.less';
import App from '../app/App';
import store from '../store';

export default () => (
  <Provider store={store}>
    <App />
  </Provider>
);
