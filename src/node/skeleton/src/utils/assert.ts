import { ICO } from '../types';

export const is = (val: any, ...args: any[]) => (
  args.every((arg: any) => (arg === val))
);

export const has = (key: string | number, obj: ICO) => key in obj;

export const isType = (val: any, type: string) => typeof val === type;

export const isFunc = (val: any) => isType(val, 'function');
