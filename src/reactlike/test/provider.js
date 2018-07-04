import * as React from 'react';
import * as PropTypes from 'prop-types';
import { createStore } from './createStore';
import { storeKey } from './provider-props';
const { Component, Children, } = React;
const { object, element, } = PropTypes;
class Provider extends Component {
    constructor(props, context) {
        super(props, context);
        this.context = {};
        this[storeKey] = props.store;
        console.log('provider init');
    }
    getChildContext() {
        return {
            [storeKey]: this[storeKey],
        };
    }
    render() {
        const { props: { children, }, } = this;
        return (React.createElement("div", null, Children.only(children)));
    }
}
Provider.propTypes = {
    [storeKey]: object.isRequired,
    children: element,
};
Provider.childContextTypes = {
    [storeKey]: object.isRequired,
};
export { Provider, createStore, };
//# sourceMappingURL=provider.js.map