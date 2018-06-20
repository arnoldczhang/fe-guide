import { isFunction } from './utils';

export default (
  type: any,
  attr: Object,
  ...children
): Object => {
  let result;
  if (isFunction(type)) {
    result = new type(attr, {}, children);
  } else {
    type = type.toUpperCase();
    result = {
      type,
      attr,
      children,
    };
  }
  // console.log(result);
  return result;
};
