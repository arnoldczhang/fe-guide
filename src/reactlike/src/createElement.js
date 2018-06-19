"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
exports.default = (tag, attr, children) => {
    let result;
    if (utils_1.isFunction(tag)) {
        result = new tag(attr, {});
    }
    else {
        tag = tag.toUpperCase();
        result = {
            tag,
            attr,
            children,
        };
    }
    console.log(result);
    return result;
};
