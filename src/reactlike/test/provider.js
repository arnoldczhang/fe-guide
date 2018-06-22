"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const PropTypes = require("prop-types");
const createStore_1 = require("./createStore");
exports.createStore = createStore_1.default;
const provider_props_1 = require("./provider-props");
const { Component, Children, } = React;
const { object, element, } = PropTypes;
class Provider extends Component {
    constructor(props, context) {
        super(props, context);
        this.context = {};
        console.log('aa');
        this[provider_props_1.storeKey] = props.store;
        context[provider_props_1.storeKey] = props.store;
    }
    render() {
        const { props: { children, }, } = this;
        return (React.createElement("div", null, Children.only(children)));
    }
}
Provider.propTypes = {
    store: object.isRequired,
    children: element,
};
exports.Provider = Provider;
//# sourceMappingURL=provider.js.map