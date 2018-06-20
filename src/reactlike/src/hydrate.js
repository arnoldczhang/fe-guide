"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
exports.default = (vnode, el) => {
    console.log(vnode);
    if (utils_1.isObject(vnode)) {
        el.innerHTML = vnode.render();
    }
    else if (utils_1.isString(vnode)) {
        el.textContent = vnode;
    }
};
//# sourceMappingURL=hydrate.js.map