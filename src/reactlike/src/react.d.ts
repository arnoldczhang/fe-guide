import hydrate from './hydrate';
import Component from './Component';
declare const React: {
    hydrate: (vnode: any, el: Element) => void;
    createElement: (type: any, attr: Object, ...children: any[]) => Object;
    Component: typeof Component;
};
export default React;
export { Component, hydrate };
