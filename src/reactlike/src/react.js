"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hydrate_1 = require("./hydrate");
exports.hydrate = hydrate_1.default;
const createElement_1 = require("./createElement");
const Component_1 = require("./Component");
exports.Component = Component_1.default;
const React = {
    hydrate: hydrate_1.default,
    createElement: createElement_1.default,
    Component: Component_1.default,
};
Object.defineProperty(window, 'React', {
    get() {
        return React;
    },
});
exports.default = React;
