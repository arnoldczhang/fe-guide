"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("../src/react");
const provider_1 = require("./provider");
console.log(1);
react_1.hydrate(react_1.default.createElement(provider_1.Provider, { store: { a: 1, b: 2 }, "data-aa": "abc" },
    react_1.default.createElement("div", { id: "a" }, "aaaa"),
    react_1.default.createElement("div", { class: "b" }, "bbbb")), document.getElementById('root'));
//# sourceMappingURL=index.js.map