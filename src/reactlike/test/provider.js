"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("../src/react");
class Provider extends react_1.Component {
    constructor(props, context, children) {
        super(props, context, children);
    }
    render() {
        console.log(112);
        const { props, } = this;
        return (react_1.default.createElement("div", Object.assign({}, props), this.children.map((child) => child.children.toString())));
    }
}
exports.Provider = Provider;
//# sourceMappingURL=provider.js.map