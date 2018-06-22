"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
exports.default = function (type, attr) {
    var children = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        children[_i - 2] = arguments[_i];
    }
    var result;
    if (utils_1.isFunction(type)) {
        result = new type(attr, {}, children);
    }
    else {
        type = type.toUpperCase();
        result = {
            type: type,
            attr: attr,
            children: children,
        };
    }
    // console.log(result);
    return result;
};
//# sourceMappingURL=createElement.js.map