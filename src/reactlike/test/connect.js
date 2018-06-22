"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const { Component, createElement, } = React;
function connect(selectorFunc) {
    return function wrapWithConnect(Comp) {
        return class Connector extends Component {
            constructor(props, context) {
                super(props, context);
                console.log('Comp init', Comp);
            }
            render() {
                return createElement(Comp);
            }
        };
    };
}
exports.connect = connect;
;
//# sourceMappingURL=connect.js.map