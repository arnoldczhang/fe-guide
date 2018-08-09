import * as React from 'react';
import { Provider } from './provider';
import App from './App';
import ErrorBandary from './ErrorBandary';
import store from './store';
console.log(12);
React.hydrate(React.createElement(Provider, { store: store },
    React.createElement(ErrorBandary, null,
        React.createElement(App, null))), document.getElementById('root'));
//# sourceMappingURL=index.js.map