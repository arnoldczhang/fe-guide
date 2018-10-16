import { Character } from './Character';
import {
  baseWeapon,
  equipedWeapon,
  baseAction,
} from './constant';
import { Cach, CO, StartConfig, CharacterAttr, Weapon } from '../types';

export const func: (value: any) => any = value => value;

export const inArray: <T = string>(arr: Array<T>, key: T) => boolean =
  (arr, key) => arr.indexOf(key) > -1;

export const without: <T = string>(arr: Array<T>, item: T) => boolean =
  (arr, item) => arr.indexOf(item) === -1;

export const copy: <T = CO>(target: T) => T =
  (target) => Object.assign({}, target);

export const eq: <T = any>(target: T, ...args: T[]) => boolean =
  (target, ...args) => !!args.length && args.every(arg => arg === target);

export const hasOwn: (target: CO, key: string) => boolean =
  (target, key) => target.hasOwnProperty(key) || key in target;

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

export const getBaseOperation: () => Weapon[][] = () => {
  const base = baseWeapon.map(weapon => copy(weapon));
  const equiped = equipedWeapon.map(weapon => copy(weapon));
  const action = baseAction.map(action => copy(action));
  return [base, equiped, action];
};

export const genCharacter: (config: StartConfig) => any = (config) => {
  const character: CharacterAttr = new Character(config).getInstance();
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
  copy,
  eq,
  getBaseOperation,
};
