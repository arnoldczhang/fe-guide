import * as React from 'react';
import * as PropTypes from 'prop-types';
// import { init as createStore } from '@rematch/core';
import { createStore } from './createStore';

// import React, { Component } from '../src/react';
import { ProviderProps, storeKey } from './provider-props';
import { VNode } from '../src/interface';

const {
  Component,
  Children,
} = React;

const {
  object,
  element,
} = PropTypes;

class Provider extends Component {
  props: ProviderProps;
  setState: Function;
  context: Object|null = {};

  static propTypes = {
    [storeKey]: object.isRequired,
    children: element,
  };

  static childContextTypes = {
    [storeKey]: object.isRequired,
  };

  constructor(
    props: ProviderProps,
    context: Object|null
  ) {
    super(props, context);
    this[storeKey] = props.store;
    console.log('provider init');
  }

  getChildContext() {
    return {
      [storeKey]: this[storeKey],
    };
  }

  render() {
    const {
      props: {
        children,
      },
    } = this;
    return (
      <div>
        {
          Children.only(children)
        }
      </div>
    );
  }
}

export {
  Provider,
  createStore,
};
