"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const provider_1 = require("../provider");
const count_1 = require("./count");
const calculate_1 = require("./calculate");
exports.default = provider_1.createStore({
    count: count_1.default,
    calculate: calculate_1.default,
});
//# sourceMappingURL=index.js.map