'use strict';

const importJsx = require('import-jsx');
const React = require('react');
const { Box, render } = require('ink');
const { Tabs, Tab } = require('ink-tab');

const Cat = importJsx('./pages/Cat.jsx');
const Trend = importJsx('./pages/Trend.jsx');
const { Component, Fragment } = React;

const args = process.argv.splice(2);
const compMap = {
  Cat,
  Trend,
};

class Monitor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Comp: compMap[args[0]] || Trend,
    };
  }

  render() {
    const {
      Comp,
    } = this.state;
    return (
      <Fragment>
        <Comp />
      </Fragment>
    );
  }
}

render(<Monitor />);




// <Tabs keyMap={{ useNumbers: true }} onChange={this.handleTabChange} flexDirection="row">
//   <Tab name="Trend">Trend</Tab>
//   <Tab name="Cat">Cat</Tab>
// </Tabs>
