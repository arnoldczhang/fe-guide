"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var PropTypes = require("prop-types");
var createStore_1 = require("./createStore");
exports.createStore = createStore_1.default;
var provider_props_1 = require("./provider-props");
var Component = React.Component, Children = React.Children;
var object = PropTypes.object, element = PropTypes.element;
var Provider = (function (_super) {
    __extends(Provider, _super);
    function Provider(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.context = {};
        _this[provider_props_1.storeKey] = props.store;
        return _this;
    }
    Provider.prototype.render = function () {
        var children = this.props.children;
        return (React.createElement("div", null, Children.only(children)));
    };
    Provider.propTypes = {
        store: object.isRequired,
        children: element,
    };
    return Provider;
}(Component));
exports.Provider = Provider;
//# sourceMappingURL=provider.js.map