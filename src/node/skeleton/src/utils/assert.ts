import { ICO } from '../types';

export const is = (val: any, ...args: any[]) => (
  args.every((arg: any) => (arg === val))
);

export const has = (key: string | number, obj: ICO) => key in obj;

export const isType = (val: any, type: string) => typeof val === type;

export const isFunc = (val: any) => isType(val, 'function');

export const isStr = (val: any) => isType(val, 'function');

export const isArr = Array.isArray;

export const assertOptions = (options: ICO = {}) => {
  const { ignore, page } = options;
  if (isStr(ignore)) {
    options.ignore = [ignore];
  } else if (!isArr(ignore) && ignore) {
    throw new TypeError('ignore传值异常');
  }

  if (!isArr(page) && page !== '*') {
    throw new TypeError('page传值异常');
  }
};
