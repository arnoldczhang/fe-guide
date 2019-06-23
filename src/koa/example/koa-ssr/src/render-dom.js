"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const server_1 = require("react-dom/server");
const react_router_dom_1 = require("react-router-dom");
const react_redux_1 = require("react-redux");
const Layout_1 = require("./components/Layout");
const getRenderDom = (context, req, store) => server_1.renderToString(React.createElement(react_redux_1.Provider, { store: store },
    React.createElement(react_router_dom_1.StaticRouter, { context: context, location: req.url },
        React.createElement(Layout_1.default, null))));
exports.default = getRenderDom;
