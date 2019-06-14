"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_dom_1 = require("react-dom");
const react_router_dom_1 = require("react-router-dom");
const react_redux_1 = require("react-redux");
const Layout_1 = require("./components/Layout");
const store_1 = require("./store");
const store = store_1.default(window.REDUX_DATA);
const jsx = (React.createElement(react_redux_1.Provider, { store: store },
    React.createElement(react_router_dom_1.BrowserRouter, null,
        React.createElement(Layout_1.default, null))));
const app = document.getElementById("app");
react_dom_1.hydrate(jsx, app);
if (process.env.NODE_ENV === "development") {
    if (module.hot) {
        module.hot.accept();
    }
    if (!window.store) {
        window.store = store;
    }
}
