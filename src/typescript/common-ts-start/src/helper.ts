import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import { VueResult, Tree } from './types';
import { write } from './fs';

export const isType = (
  val: any,
  type: string,
): boolean => typeof val === type;

export const isFunc = (val: any) => isType(val, 'function');

export const isStr = (val: any) => isType(val, 'string');

export const isRe = (val: any) => val instanceof RegExp;

export const errorCatch = (
  fn: any,
  fnName?: string,
): any => {
  if (isFunc(fn)) {
    return (...args: any[]) => {
      try {
        return fn(...args);
      } catch (err) {
        throw new Error(`捕获异常：${fnName || fn.name} -> ${err.message}`);
      }
    };
  }
  throw new Error('fn必须是function');
};

export const errorCatchSync = (fn: any): any => {
  if (isFunc(fn)) {
    return async (...args: any[]) => {
      try {
        const result = await fn(...args);
        return result;
      } catch (err) {
        throw new Error(`捕获异常：${fn.name} -> ${err.message}`);
      }
    };
  }
  throw new Error('fn必须是function');
};

export const isDeclaration = (input: string): boolean =>
  /\.d\.ts$/.test(input)
;

export const isTypescript = (input: string): boolean =>
  /\.tsx?$/.test(input)
;

export const isRelativePath = (path: string): boolean =>
  /^\.{1,2}\//.test(path)
;

export const replaceImport = (
  value: string,
  path: string,
): string => value.replace(/~?@\//, `${path}/`);

export const getOnly = (
  value: NodePath<t.Node> | NodePath<t.Node>[],
): NodePath<t.Node> => {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
};

export const genTreeMap = (map: Map<string, VueResult>) => {
  // FIXME
};