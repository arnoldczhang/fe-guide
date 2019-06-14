"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fetch = require("isomorphic-fetch");
function fetchCircuits() {
  return fetch("https://api.github.com/repos/jasonboy/wechat-jssdk/branches")
    .then(res => res.json())
    .then(res => res);
}
exports.fetchCircuits = fetchCircuits;
