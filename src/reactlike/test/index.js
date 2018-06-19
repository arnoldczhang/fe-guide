"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_redux_1 = require("react-redux");
console.log(1121212);
react_1.hydrate(<react_redux_1.Provider store={{ a: 1, b: 2 }}>
    <div id="a">aaaa</div>
  </react_redux_1.Provider>, document.getElementById('root'));
