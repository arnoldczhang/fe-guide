"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_redux_1 = require("react-redux");
const store_1 = require("../store");
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  componentDidMount() {
    if (this.props.circuits.length <= 0) {
      this.props.fetchData();
    }
  }
  handleClick() {
    console.log(123);
  }
  render() {
    const { circuits } = this.props;
    return React.createElement(
      "div",
      null,
      React.createElement("h2", null, "F1 2018 Season Calendar"),
      React.createElement("button", { onClick: this.handleClick }, "click"),
      React.createElement(
        "ul",
        null,
        circuits.map(({ name }) =>
          React.createElement("li", { key: name }, name)
        )
      )
    );
  }
}
Home.serverFetch = store_1.fetchData;
const mapStateToProps = state => ({
  circuits: state.data
});
const mapDispatchToProps = {
  fetchData: store_1.fetchData
};
exports.default = react_redux_1.connect(mapStateToProps, mapDispatchToProps)(
  Home
);
