import * as React from 'react';
import * as PropTypes from 'prop-types';
// import { init as createStore } from '@rematch/core';
import createStore from './createStore';

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
  context: Object|null = {};

  static propTypes = {
    store: object.isRequired,
    children: element,
  };

  constructor(
    props: ProviderProps,
    context: Object|null
  ) {
    super(props, context);
    console.log('aa');
    this[storeKey] = props.store;
    context[storeKey] = props.store;
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
