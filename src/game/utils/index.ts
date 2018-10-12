import { Character } from './Character';
import { Cach, CO, StartConfig } from '../types';

export const func: (value: any) => any = value => value;
export const inArray: (arr: Array<string>, key: any) => boolean = (arr, key) => arr.indexOf(key) > -1;

export const cach: Cach = {
  KEY: 'TAIWU',
  getKey(key: string): string {
    return `${this.KEY}_${key}`;
  },
  clear(key: string, value: any = ''): void {
    if (typeof window !== 'undefined') {
      key = this.getKey(key);
      window.localStorage.setItem(key, value || '');
    }
  },
  get(key: string): any {
    if (typeof window !== 'undefined') {
      key = this.getKey(key);
      let result = window.localStorage.getItem(key) || '';
      try {
        result = JSON.parse(result);
      } catch (err) {
        ;
      }
      return result;
    }
  },
  set(key: string, value: string|CO): void {
    if (typeof window !== 'undefined') {
      key = this.getKey(key);
      if (typeof value === 'object') {
        value = JSON.stringify(value);
      }
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

export const genCharacter: (config: StartConfig) => any = (config) => {
  const character = new Character(config);
  console.log(character);
};

export const genMap: (config: StartConfig) => void = () => {

};

export default {
  cach,
  inArray,
  without,
  func,
  hasOwn,
  genCharacter,
  genMap,
};
