"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
// import { Provider } from 'react-redux';
// import React, { hydrate } from '../src/react';
var provider_1 = require("./provider");
var App_1 = require("./App");
var store_1 = require("./store");
React.hydrate(React.createElement(provider_1.Provider, { store: store_1.default },
    React.createElement(App_1.default, null)), document.getElementById('root'));
//# sourceMappingURL=index.js.map