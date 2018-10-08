import { Cach } from '../types';

export const cach: Cach = {
  KEY: 'taiwu',
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

export default {
  cach,
};
