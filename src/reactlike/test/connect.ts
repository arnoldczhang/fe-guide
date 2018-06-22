import * as React from 'react';

const {
  Component,
  createElement,
} = React;

export function connect(selectorFunc: Function): any {
  return function wrapWithConnect(Comp) {
    return class Connector extends Component {
      constructor(props, context) {
        super(props, context);
        console.log('Comp init', Comp);
      }

      render() {
        return createElement(Comp);
      }
    }
  };
};