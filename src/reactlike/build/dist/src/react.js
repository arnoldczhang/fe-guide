"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var hydrate_1 = require("./hydrate");
exports.hydrate = hydrate_1.default;
var createElement_1 = require("./createElement");
var Component_1 = require("./Component");
exports.Component = Component_1.default;
var React = {
    hydrate: hydrate_1.default,
    createElement: createElement_1.default,
    Component: Component_1.default,
};
Object.defineProperty(window, 'React', {
    get: function () {
        return React;
    },
});
exports.default = React;
//# sourceMappingURL=react.js.map