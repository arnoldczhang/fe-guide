import React, {
  Component,
  createElement,
} from 'react';
import {
  action,
} from 'mobx';

const {
  getOwnPropertyDescriptors,
  defineProperty,
  keys,
} = Object;

const isStateless = (component) => !(component.prototype && component.prototype.render);

const extendDescriptors = (actions, componentClass) => {
  const protoKlass = componentClass.prototype;
  const descriptors = getOwnPropertyDescriptors(actions);
  keys(descriptors).forEach((name) => {
    defineProperty(protoKlass, name, action(protoKlass, name, descriptors[name]));
  });
  return componentClass;
};

export default function bindAct(actions) {
  return function (componentClass) {
    const displayName = 'action-' + (componentClass.displayName || componentClass.name || 'Unknown');
    componentClass = extendDescriptors(actions, componentClass);
    
    class Klass extends Component {
      render() {
        const newProps = {};
        for (let key in this.props) {
          if (this.props.hasOwnProperty(key)) {
            newProps[key] = this.props[key];
          }
        }

        if (!isStateless(componentClass)) {
          newProps.ref = this.storeRef;
        }
        return createElement(componentClass, newProps);
      }
    }
    Klass.displayName = displayName;
    return Klass;
  };
};
