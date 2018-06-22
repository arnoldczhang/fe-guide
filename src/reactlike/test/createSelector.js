"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../src/utils");
exports.default = (...args) => {
    let callback;
    let argsLength = args.length;
    if (argsLength) {
        callback = args.pop();
        if (utils_1.isFunction(callback)) {
            if (argsLength > 1) {
                return (state) => {
                    return callback.apply(state, args.reduce((result, selector) => {
                        result.push(selector(state));
                        return result;
                    }, []));
                };
            }
            return (state) => {
                return callback.call(state, state);
            };
        }
        else {
        }
    }
    else {
    }
};
//# sourceMappingURL=createSelector.js.map