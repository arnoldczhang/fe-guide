import { isString, isObject } from './utils';

export default (vnode: any, el: Element): void => {
  console.log(vnode);
  if (isObject(vnode)) {
    el.innerHTML = vnode.render();
  } else if (isString(vnode)) {
    el.textContent = vnode;
  }
};
