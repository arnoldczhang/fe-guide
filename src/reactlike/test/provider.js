"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const PropTypes = require("prop-types");
const createStore_1 = require("./createStore");
exports.createStore = createStore_1.createStore;
const provider_props_1 = require("./provider-props");
const { Component, Children, } = React;
const { object, element, } = PropTypes;
class Provider extends Component {
    constructor(props, context) {
        super(props, context);
        this.context = {};
        this[provider_props_1.storeKey] = props.store;
        console.log('provider init');
    }
    getChildContext() {
        return {
            [provider_props_1.storeKey]: this[provider_props_1.storeKey],
        };
    }
    render() {
        const { props: { children, }, } = this;
        return (React.createElement("div", null, Children.only(children)));
    }
}
Provider.propTypes = {
    [provider_props_1.storeKey]: object.isRequired,
    children: element,
};
Provider.childContextTypes = {
    [provider_props_1.storeKey]: object.isRequired,
};
exports.Provider = Provider;
//# sourceMappingURL=provider.js.map