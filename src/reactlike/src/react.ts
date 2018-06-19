import hydrate from './hydrate';
import createElement from './createElement';
import Component from './Component';

const React = {
  hydrate,
  createElement,
  Component,
};

Object.defineProperty(window, 'React', {
  get() {
    return React;
  },
});

export default React;

export {
  Component,
};