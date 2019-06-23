"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Home_1 = require("./components/Home");
const About_1 = require("./components/About");
const Contact_1 = require("./components/Contact");
const Secret_1 = require("./components/Secret");
const routes = [
  {
    path: "/",
    component: Home_1.default,
    exact: true
  },
  {
    path: "/about",
    component: About_1.default,
    exact: true
  },
  {
    path: "/contact",
    component: Contact_1.default,
    exact: true
  },
  {
    path: "/secret",
    component: Secret_1.default,
    exact: true
  }
];
exports.default = routes;
