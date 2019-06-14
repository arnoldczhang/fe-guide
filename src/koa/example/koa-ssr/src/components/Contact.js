"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_helmet_1 = require("react-helmet");
const Contact = () =>
  React.createElement(
    "div",
    null,
    React.createElement("h2", null, "This is the contact page"),
    React.createElement(
      react_helmet_1.default,
      null,
      React.createElement("title", null, "Contact Page"),
      React.createElement("meta", {
        name: "description",
        content: "This is a proof of concept for React SSR"
      })
    )
  );
exports.default = Contact;
