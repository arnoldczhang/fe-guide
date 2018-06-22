"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
exports.default = (type, attr, ...children) => {
    let result;
    if (utils_1.isFunction(type)) {
        result = new type(attr, {}, children);
    }
    else {
        type = type.toUpperCase();
        result = {
            type,
            attr,
            children,
        };
    }
    return result;
};
//# sourceMappingURL=createElement.js.map