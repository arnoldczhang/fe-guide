"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_router_dom_1 = require("react-router-dom");
const Header_1 = require("./Header");
const routes_1 = require("../routes");
class Layout extends React.Component {
  constructor(props = {}) {
    super(props);
    this.state = {
      title: "Welcome to React SSR!"
    };
  }
  render() {
    return React.createElement(
      "div",
      null,
      React.createElement("h1", null, this.state.title),
      React.createElement(Header_1.default, null),
      React.createElement(
        react_router_dom_1.Switch,
        null,
        routes_1.default.map(route =>
          React.createElement(
            react_router_dom_1.Route,
            Object.assign({ key: route.path }, route)
          )
        )
      )
    );
  }
}
exports.default = Layout;
