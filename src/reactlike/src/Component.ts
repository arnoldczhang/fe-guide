import React, { hydrate } from '../src/react';
import { VNode } from '../src/interface';

export default class {
  props: Object;
  context: Object|null;
  children: Array<VNode>|null;

  constructor(props: Object, context: Object|null, ...children:Array<VNode>|null) {
    this.props = props;
    this.context = context;
    this.children = children;
  }

  shouldComponentUpdate(): boolean {
    return true;
  }

  componentDidMount(): void {

  }

  setState(state: Object, callback: Function|null): void {

  }
}