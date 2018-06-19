import { isFunction } from './utils';

export default (
  tag: any,
  attr: Object,
  children?: Array<any>|string|null,
): Object => {
  let result;
  if (isFunction(tag)) {
    result = new tag(attr, {});
  } else {
    tag = tag.toUpperCase();
    result = {
      tag,
      attr,
      children,
    };
  }
  console.log(result);
  return result;
};
