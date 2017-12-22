import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import ErrorBoundary from './components/error/Error';
import './index.css';
import App from './app/App';
import store from './store';

render(
  <Provider store={store}>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </Provider>,
  document.getElementById('root'),
);
