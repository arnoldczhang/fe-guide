import { PATH } from '../config/cach';
import { ICach, ICO } from '../types';

const cache: ICach = {
  [PATH]: {},
};

export const setCach = (
  key: string | number,
  value: any,
  parentKey?: string,
): void => {
  let result: ICach = cache;
  if (parentKey) {
    result = cache[parentKey] || {};
  }
  result[key] = value;
};

export const getCach = (
  key: string | number,
  parentKey?: string,
): any => {
  let result: ICach = cache;
  if (parentKey) {
    result = result[parentKey];
  }
  return result[key];
};

export const hasCach = (
  key: string | number,
  parentKey?: string,
): boolean => {
  let result: ICach = cache;
  if (parentKey) {
    result = result[parentKey];
  }
  return key in result;
};
