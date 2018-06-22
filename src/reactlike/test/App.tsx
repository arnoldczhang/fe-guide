import * as React from 'react';
// import { connect } from 'react-redux';
import { connect } from './connect';
import selector from './app-selector';

@connect(selector)
export default class App extends React.PureComponent {

  constructor(props, context) {
    super(props, context);
    console.log('app init');
  }

  render() {
    return [
       <div>abc</div>,
       <div>abc</div>,
       <div>abc</div>,
       <div>abc</div>
    ];
  }
}

