import { Cach, CO } from '../types';

export const cach: Cach = {
  KEY: 'TAIWU',
  get(key: string = ''): any {
    key = `${this.KEY}${key}`;
    if (typeof window !== 'undefined') {
      return window.localStorage.getItem(key);
    }
  },
  set(key: string = '', value: string = ''): void {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, value);
    }
  },
};

export const without: (
  targetArray: Array<any>,
  item: any,
) => boolean = (
  targetArray,
  item,
) => targetArray.indexOf(item) === -1;

export const hasOwn: (target: CO, key: string) => boolean = (target, key) => (
  target.hasOwnProperty(key) || key in target
);

export const func: (value: any) => any = value => value;

export default {
  cach,
  without,
  func,
  hasOwn,
};
