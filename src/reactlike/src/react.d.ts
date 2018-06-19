import Component from './Component';
declare const React: {
    hydrate: (msg: string, el: Element) => void;
    createElement: (tag: any, attr: Object, children?: string | any[]) => Object;
    Component: typeof Component;
};
export default React;
export { Component };
