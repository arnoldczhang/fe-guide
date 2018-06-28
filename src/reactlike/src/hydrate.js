import { isString, isObject } from './utils';
export default (vnode, el) => {
    console.log(vnode);
    if (isObject(vnode)) {
        el.innerHTML = vnode.render();
    }
    else if (isString(vnode)) {
        el.textContent = vnode;
    }
};
//# sourceMappingURL=hydrate.js.map