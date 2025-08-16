import { wx } from "../config";
import { ICO } from "../types";
import { isArr, isObj } from "./assert";

const {
  keys,
} = Object;

export const to36 = (num: number = Math.random()): string => num.toString(36).slice(2);

export const getRepeatArr = (times: number, filler: any) => Array(times).fill(filler);

/**
 * genKlass
 * @param num
 */
export const genKlass = (num: number = Math.random()): string[] => {
  let klass = to36(num);
  if (!isNaN(Number(klass[0]))) {
    klass = (Number(klass[0]) - -10).toString(36) + klass.slice(1);
  }
  return [klass, `.${klass}`];
};

/**
 * fillDefaultValue
 * @param obj
 */
export const fillDefaultValue = (obj: ICO = {}): ICO => {
  keys(obj).forEach((key: string): void => {
    const value = obj[key];
    if (isObj(value) && (!value || !keys(keys).length)) {
      obj[key] = wx;
    }
  });
  return obj;
};

/**
 * combine
 * @param arr
 */
export const combine = (arr: any[]): any[] => {
  if (arr.length && arr.concat) {
    return arr.concat.apply([], arr);
  }
  return arr;
};

/**
 * appendUniq
 * @param arr
 * @param item
 */
export const appendUniq = (
  arr: any[],
  ...args: any[]
): any[] => {
  if (isArr(arr)) {
    return [...arr, ...args];
  }
  return arr;
};
