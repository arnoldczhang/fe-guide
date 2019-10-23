import { SKELETON, WXSS_BG_GREY } from "../config";
import { CF } from "../types";
import { isStr } from "./assert";
import { identity } from "./dir";

// =========== //
// === test === //
// =========== //
export const hasDefaultBg = (input: string): boolean => (
  new RegExp(`\\b${WXSS_BG_GREY.replace(/\-/g, '\\-')}\\b`).test(input)
);

export const isSkeleton = (input: string): boolean => (
  new RegExp(`\\/${SKELETON}\\/`).test(input)
);

export const isSkeletonStyle = (input: string): boolean => (
  new RegExp(`${SKELETON}\\.(?:s?css|less|w?xss|sass)$`).test(input)
);

export const isEvent = (input: string): boolean => (
  /^on[A-Z]\w+/.test(input)
);

export const hasSuffix = (input: string): boolean => (
  /\.[a-zA-Z]+$/.test(input)
);

export const isRelativePath = (input: string): boolean => (
  /^\.\.?\//.test(input)
);

export const isCssFile = (input: string): boolean => (
  /\.(?:s?css|less|w?xss|sass)$/.test(input)
);

export const isTypescript = (input: string): boolean => (
  /\.tsx?$/.test(input)
);

export const isCompMethod = (input: string): boolean => (
  /^component(?:Will|Did)/.test(input)
);

export const isColor = (input: string): boolean => (
  /^(?:#[a-zA-Z0-9]{3,6}|rgba?|hsla?|[a-zA-Z])/.test(input)
);

export const isWxml = (input: string): boolean => (
  /\.wxml$/.test(input)
);

export const isNpmComponent = (path: string): boolean => (
  /^~@/.test(path)
);

export const isBindEvent = (key: string): boolean => (
  /^(capture-)?(?:bind|catch)\:?\w+$/.test(key)
);

export const isForRelated = (key: string): boolean => (
  /^wx\:(?:for|for-index|for-item|key)/.test(key)
);

export const isCssSymbol = (input: string): boolean => (
  /[\+~>]/.test(input)
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

export const isIfAll = (key: string): boolean => (
  /^wx:(?:if|elif|else)/.test(key)
);

export const isHidden = (key: string): boolean => (
  /^hidden/.test(key)
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
  /^\s*[!~\-\+\/]*\(?([^'"\.\s]+)\./.test(input)
);

export const hasUnDefVariable = (input: string): boolean => (
  /^([^\s]+) is not defined/.test(input)
);

export const hasUnDefProperty = (input: string): boolean => (
  /^Cannot read property ['"]([^'"]+)['"] of (?:undefined|null)/.test(input)
);

export const isItemVar = (input: string): boolean => (
  /item\.?/.test(input)
);

export const isGenWxss = (input: string): boolean => (
  new RegExp(`\\.${SKELETON}\\.wxss['"]?$`).test(input)
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
  key.match(/(?:^([\.\-\w]+)*(#[^#\.\:]+)([\.\-\w]+)*(\:\:?[a-z]+)?$)/)
);

export const matchCallExpression = (input: string): string[] => (
  input.match(/\b(?:(?:this|that|self)\.|)(\w+)/g) || []
).map((inp: string): string => (
  inp.replace(/^(?:this|that|self)\.(\w+)/, '$1')
));

// ============== //
// === replace === //
// ============== //
export const removeStartEndBrace = (input: string): string => (
  input.replace(/^\{([\s\S]*)\}$/, '$1')
);
export const removeDefaultBg = (
  input: string,
): string => (
  input.replace(new RegExp(`\\b${WXSS_BG_GREY.replace(/\-/g, '\\-')}\\b`, 'g'), '')
);

export const replaceWith = (
  input: string,
  reg: RegExp | string = /\s+/,
  replacement?: CF,
): string => (
  input.replace(reg, replacement)
);

export const addSuffixWxss = (
  input: string,
  suffix = SKELETON,
): string => (
  input.replace(/(.+)\.(wxss)$/, `$1.${suffix}.$2`)
);

export const interceptWxVariable = (
  input: any,
  replacement?: string,
): string => (
  isStr(input) ? input.replace(/\{\{([^\{\}]*)\}\}/, replacement || '$1') : input
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

export const removeBlankAndWxVariable = (input: string): string => (
  input.replace(/(?:^\s+|\s+$|^ +| +$|\{\{[^\{\}]*\}\})/g, '')
);

// rgb(0, 0, 0)
// hsl(0, 0, 0)
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
/**
 * iterateObjValue
 * @param input
 * @param iteratee
 */
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

/**
 * getTemplateName
 * @param input
 */
export const getExecRes = (
  input: string,
  reg: RegExp = /<template[^\/\>]*name=(['"])([^'"]+)\1[^\/\>]*\/?>/g,
  index: number = 2,
): string[] => {
  const result: string[] = [];
  let exRes = reg.exec(input);
  while (exRes) {
    result.push(exRes[index]);
    exRes = reg.exec(input);
  }
  return result;
};

/**
 * getTemplateName
 * @param input
 */
export const getTemplateName = (
  input: string,
): string[] => (
  getExecRes(input)
);

/**
 * getTemplateIs
 * @param input
 */
export const getTemplateIs = (
  input: string,
): string[] => (
    getExecRes(input, /<template[^\/\>]*is=(['"])([^'"]+)\1[^\/\>]*\/?>/g)
);

/**
 * getPropTarget
 * @param input
 * @param prop
 */
export const getPropTarget = (
  input: string,
  prop: string,
): string[] => {
  const result = [];
  const parentRE = new RegExp(`([^\\s\\{]+)${prop}`);
  const parentRes: any[] = parentRE.exec(input) || [];
  input = parentRes[1] || prop;
  const singleParentRE = new RegExp(`(?:(\\w+)\\.?|\\[['"]?(\\w+)['"]?\\])$`, 'g');
  let temp = singleParentRE.exec(input);
  while (temp) {
    input = input.slice(0, temp.index);
    singleParentRE.lastIndex = 0;
    result.unshift(temp[1]);
    temp = singleParentRE.exec(input);
  }
  return result;
};

// =========== //
// === split === //
// =========== //
export const splitWith = (
  input: string,
  reg: RegExp | string = /\s+/,
): string[] => (
  input.split(reg).filter(identity)
);
