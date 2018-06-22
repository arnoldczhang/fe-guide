"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const createSelector_1 = require("./createSelector");
const countSelector = state => state.count;
const calculateSelector = state => state.calculate;
exports.default = createSelector_1.default(countSelector, calculateSelector, (count, calculate) => (Object.assign({}, count, calculate)));
//# sourceMappingURL=app-selector.js.map