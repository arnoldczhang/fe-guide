
export function isString<T>(str: T): boolean {
  return typeof str === 'string' || str instanceof String;
};

export function isFunction<T>(func: T): boolean {
  return typeof func === 'function';
};

export function isObject<T>(obj: T): boolean {
  return typeof obj === 'object';
};
