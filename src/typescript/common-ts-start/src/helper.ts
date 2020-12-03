export const isType = (
  val: any,
  type: string,
): boolean => typeof val === type;

export const isFunc = (val: any) => isType(val, 'function');
export const isStr = (val: any) => isType(val, 'string');
export const isRe = (val: any) => val instanceof RegExp;

export const errorCatch = (fn: any): any => {
  if (isFunc(fn)) {
    return (...args: any[]) => {
      try {

        return fn(...args);
      } catch (err) {
        throw new Error(err.message);
      }
    };
  }
  throw new Error('fn必须是function');
};
