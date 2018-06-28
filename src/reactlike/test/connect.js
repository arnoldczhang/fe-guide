import * as React from 'react';
import * as PropTypes from 'prop-types';
import { subscribe } from './createStore';
import { storeKey } from './provider-props';
const { Component, createElement, } = React;
const { object, } = PropTypes;
export function connect(selectorFunc) {
    return function wrapWithConnect(Comp) {
        return _a = class Connector extends Component {
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
                    return createElement(Comp, Object.assign({}, this[storeKey], props));
                }
            },
            _a.contextTypes = {
                [storeKey]: object.isRequired,
            },
            _a;
        var _a;
    };
}
;
//# sourceMappingURL=connect.js.map