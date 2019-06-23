"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_router_dom_1 = require("react-router-dom");
const react_redux_1 = require("react-redux");
const Header = ({ loggedIn }) =>
  React.createElement(
    "div",
    null,
    React.createElement(react_router_dom_1.Link, { to: "/" }, "Home"),
    React.createElement(react_router_dom_1.Link, { to: "/about" }, "About"),
    React.createElement(react_router_dom_1.Link, { to: "/contact" }, "Contact"),
    loggedIn &&
      React.createElement(react_router_dom_1.Link, { to: "/secret" }, "Secret")
  );
const mapStateToProps = state => ({
  loggedIn: state.loggedIn
});
exports.default = react_redux_1.connect(mapStateToProps)(Header);
