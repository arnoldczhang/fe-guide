"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var provider_1 = require("../provider");
var count_1 = require("./count");
var calculate_1 = require("./calculate");
exports.default = provider_1.createStore({
    count: count_1.default,
    calculate: calculate_1.default,
});
//# sourceMappingURL=index.js.map