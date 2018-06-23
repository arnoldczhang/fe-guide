"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const PropTypes = require("prop-types");
const createStore_1 = require("./createStore");
const provider_props_1 = require("./provider-props");
const { Component, createElement, } = React;
const { object, } = PropTypes;
function connect(selectorFunc) {
    return function wrapWithConnect(Comp) {
        return _a = class Connector extends Component {
                constructor(props, context) {
                    super(props, context);
                    this[provider_props_1.storeKey] = props[provider_props_1.storeKey] || context[provider_props_1.storeKey];
                    console.log('connnect inite');
                    createStore_1.subscribe(this.onStateChange.bind(this));
                }
                onStateChange() {
                    this.setState({});
                }
                render() {
                    const props = selectorFunc(this[provider_props_1.storeKey].getState());
                    return createElement(Comp, Object.assign({}, this[provider_props_1.storeKey], props));
                }
            },
            _a.contextTypes = {
                [provider_props_1.storeKey]: object.isRequired,
            },
            _a;
        var _a;
    };
}
exports.connect = connect;
;
//# sourceMappingURL=connect.js.map