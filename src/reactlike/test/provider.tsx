// import React, { Component } from 'anujs';
import React, { Component } from '../src/react';
import Props from './provider-props';
import { VNode } from '../src/interface';

export class Provider extends Component {

  constructor(props: Props, context: Object|null, ...children: Array<VNode>|null) {
    super(props, context, children);
  }

  render() {
    console.log(112);
    const {
      props,
    } = this;
    return (
      <div {...props} >
        {
          this.children.map((child) => child.children.toString())
        }
      </div>
    );
  }
}