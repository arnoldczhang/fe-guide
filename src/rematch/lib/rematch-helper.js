// eslint-disable-next-line
const isType = type => value => typeof value === type;

export const is = {
  object: isType('object'),
  func: isType('function'),
  arr: Array.isArray,
  void0: isType('undefined'),
  bool: isType('boolean'),
};

is.promise = obj => obj && is.func(obj.then);
is.null = obj => !obj && is.object(obj);

export const expect = (val, checkFn, message) => {
  if (is.func(checkFn)) {
    if (!checkFn(val)) {
      throw new Error(message);
    }
  } else {
    throw new Error('`checkFn` must be a function');
  }
};

export const getCurrentPage = () => {
  const pages = getCurrentPages();
  return pages[pages.length - 1];
};
