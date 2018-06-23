import * as React from 'react';
import * as PropTypes from 'prop-types';
import { subscribe } from './createStore';
import { storeKey } from './provider-props';
import { StoreProps } from './provider-props';


const {
  Component,
  createElement,
} = React;

const {
  object,
} = PropTypes;

export function connect(selectorFunc: Function): any {
  return function wrapWithConnect(Comp) {
    return class Connector extends Component {
      [storeKey]: StoreProps;
      setState: Function;

      static contextTypes = {
        [storeKey]: object.isRequired,
      };

      constructor(props, context) {
        super(props, context);
        this[storeKey] = props[storeKey] || context[storeKey];
        console.log('connnect inite');
        subscribe(this.onStateChange.bind(this));
      }

      onStateChange() {
        this.setState({});
      }

      render() {
        const props = selectorFunc(this[storeKey].getState());
        return createElement(Comp, (<any>Object).assign({}, this[storeKey], props));
      }
    }
  };
};