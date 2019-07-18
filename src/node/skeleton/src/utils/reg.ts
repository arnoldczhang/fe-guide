import { CF } from "../types";
import { isStr } from "./assert";

// =========== //
// === test === //
// =========== //
export const isNpmComponent = (path: string): boolean => (
  /^~@/.test(path)
);

export const isBindEvent = (key: string): boolean => (
  /^(capture-)?(?:bind|catch)\:?\w+$/.test(key)
);

export const isForRelated = (key: string): boolean => (
  /^wx\:(?:for|for-index|for-item|key)/.test(key)
);

export const isElif = (key: string): boolean => (
  /^wx:(?:elif)$/.test(key)
);

export const isIf = (key: string): boolean => (
  /^wx:(?:if)$/.test(key)
);

export const isElse = (key: string): boolean => (
  /^wx:(?:else)$/.test(key)
);

export const isId = (key: string): boolean => (
  /^#?id$/.test(key)
);

export const isKlass = (key: string): boolean => (
  /^.?class$/.test(key)
);

export const hasWxVariable = (input: string): boolean => (
  /\{\{[^\{\}]*\}\}/.test(input)
);

// https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/wxml-wxss.html
export const withoutPageSelector = (selector: string): boolean => (
  !/(?:^[a-zA-Z]|^\:\:?|#|\[)/.test(selector)
);

export const hasObjKey = (input: string): boolean => (
  /^\s*[!~\-\+\/]*([^\.]+)\./.test(input)
);

export const hasUnDefVariable = (input: string): boolean => (
  /^([^\s]+) is not defined/.test(input)
);

// ============= //
// === match === //
// ============= //
export const splitWxAttrs = (input: string): string[] => (
  input.match(/(\s*[^\{\}\s]+|\s*\{\{[^\{\}]+\}\})+?/g)
    .reduce((res: string[], attr: string) => {
      const index = Math.max(res.length - 1, 0);
      if (!/^\s/.test(attr)) {
        res[index] = `${res[index] || ''}${attr}`;
      } else {
        res.push(attr.trim());
      }
      return res;
    }, [])
);

// page#aa
// .aa#bb
// #aa
// #aa:focus
// #aa.bb:focus
// page#aa.bb:focus
export const matchIdStyle = (key: string): any[] | null => (
  key.match(/(?:^([\.\w]+)?(#[^#\.\:]+)(\.\w+)?(\:[a-z]+)?$)/)
);

// ============== //
// === replace === //
// ============== //
export const interceptWxVariable = (
  input: any,
  replacement?: string,
): string => (
  isStr(input) ? input.replace(/\{\{([^\{\}]+)\}\}/, replacement || '$1') : input
);

export const replacePseudo = (
  input: string,
  replacement?: string,
): string => (
  input.replace(/::?[a-zA-Z\-]+/g, replacement || '')
);

export const removeComment = (file: string): string => (
  file
    .replace(/(\/\*)((?!\1)[\s\S])*\*\//g, '')
    .replace(/(\/\*)((?!\*\/)[\s\S])*\*\//g, '')
    .replace(/(<!--)((?!\1)[\s\S])*-->/g, '')
    .replace(/(<!--)((?!-->)[\s\S])*-->/g, '')
    .replace(/(\s|^)\/\/.*/g, '$1')
);

export const removeBlank = (input: string): string => (
  input.replace(/(?:\n|\t|^ +| +$|\{\{[^\{\}]*\}\})/g, '')
);

// rgb(0, 0, 0)
// #f1f1f1
export const replaceColorSymbol = (input: string): string => (
  input.replace(/[#,\(\)\s]*/g, '')
);

// 100%
// 100rpx
// 100px
// 10em
// 10rem
export const replaceLengthSymbol = (input: string): string => (
  input.replace(/%/g, 'pct')
    .replace(/\s/g, '')
);

export const trim = (input: string): string => (
  input.replace(/\s/g, '')
);

// =========== //
// === exec === //
// =========== //
export const iterateObjValue = (
  input: string,
  iteratee: (r: any[] | null) => void,
) => {
  const valRE = /\:\s*(.+),?\s/g;
  let res: any[] | null = valRE.exec(input);
  while (res) {
    iteratee(res);
    res = valRE.exec(input);
  }
};

// =========== //
// === split === //
// =========== //
export const splitWith = (
  input: string,
  reg: RegExp | string = /\s+/,
) => (
  input.split(reg)
);
