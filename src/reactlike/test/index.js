"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const provider_1 = require("./provider");
const App_1 = require("./App");
const store_1 = require("./store");
React.hydrate(React.createElement(provider_1.Provider, { store: store_1.default },
    React.createElement(App_1.default, null)), document.getElementById('root'));
//# sourceMappingURL=index.js.map