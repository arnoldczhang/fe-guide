"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("../src/react");
const provider_1 = require("./provider");
react_1.default.hydrate(<provider_1.Provider store={{ a: 1, b: 2 }}>
    <div id="a">aaaa</div>
  </provider_1.Provider>, document.getElementById('root'));
