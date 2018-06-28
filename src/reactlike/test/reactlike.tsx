import React, { hydrate, Component } from '../src/react';

type AppProps = {
  word: string;
}

class App extends Component {
  constructor(props: AppProps, context) {
    super(props, context);
  }

  static defaultProps = {
    word: '',
  };

  render() {
    const {
      word = '',
    } = this.props;
    return (
      <div>{word}</div>
      );
  }
}

hydrate(
  <div>
    <App word="aa" />
  </div>,
  document.getElementById('root')
)
