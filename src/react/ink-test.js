'use strict';
const React = require('react');
const {render, Color, Box, Text} = require('ink');

class Counter extends React.Component {
  constructor() {
    super();

    this.state = {
      counter: 0
    };
  }

  render() {
    return (
      <Box flexDirection="column" marginTop={1}>
        <Text bold>I am bold</Text>
        <Color green>
          {this.state.counter} tests passed
        </Color>
        <Color red>
          {this.state.counter} tests passed
        </Color>
      </Box>
    );
  }

  componentDidMount() {
    this.timer = setInterval(() => {
      this.setState(prevState => ({
        counter: prevState.counter + 1
      }));
    }, 100);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }
}

render(<Counter/>);