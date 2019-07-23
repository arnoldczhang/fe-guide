import { CF, ICO, INpmOptions } from '../types';

export const is = (val: any, ...args: any[]): boolean => (
  args.every((arg: any) => (arg === val))
);

export const has = (key: string | number, obj: ICO): boolean => key in obj;

export const isType = (val: any, type: string): boolean => typeof val === type;

export const isFunc = (val: any): boolean => isType(val, 'function');

export const isObj = (val: any): boolean => isType(val, 'object');

export const isStr = (val: any): boolean => isType(val, 'string') || val instanceof String;

export const isFalsy = (value: any): boolean => (
  !value || value === 'null' || value === 'false'
    || value === 'NaN' || value !== value || Number(value) === 0
    || value === 'undefined' || /void \d+/g.test(value)
);

export const isTrue = (value: any): boolean => (
  value || value === 'true' || value === '1'
);

export const isArr = Array.isArray;

export const assert = (
  pass: boolean,
  errMsg: string,
): void => {
  if (!pass) {
    throw new Error(errMsg);
  }
};

export const assertOptions = (options: INpmOptions = {}): INpmOptions => {
  const defaultOptions: INpmOptions = {
    ignore: [],
    page: '*',
    inputDir: './src',
    outDir: './src',
  };
  options = { ...defaultOptions, ...options };
  const {
    ignore,
    page,
    inputDir = '',
    outDir = '',
  } = options;
  if (isStr(ignore)) {
    options.ignore = [ignore as string];
  } else {
    assert(!(!isArr(ignore) && ignore), 'ignore传值异常');
  }
  assert(!(!isArr(page) && page !== '*'), 'page传值异常');
  assert(isStr(inputDir), 'inputDir传值异常');
  assert(isStr(outDir), 'outDir传值异常');
  return options;
};
