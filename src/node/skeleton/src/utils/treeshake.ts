import { NodePath } from '@babel/core';
import * as css from 'css';
import {
  COMMENT_TAG,
  IMPORT_TAG,
  INCLUDE_TAG,
  RULE_TAG,
  TEMPLATE_TAG,
  TEXT,
  wx,
  WX_DATA,
  WX_HIDDEN,
  WX_IF,
} from "../config";
import { IAst, ICO, IPath } from "../types";
import { is, isArr, isObj, isStr } from "./assert";
import { transform, traverse } from './babel';
import { identity, modifySuffix } from './dir';
import { exists, read } from './fs';
import Logger from './log';
import { combine, fillDefaultValue, getRepeatArr } from './random';
import {
  getPropTarget,
  hasObjKey,
  hasUnDefProperty,
  hasUnDefVariable,
  isCssSymbol,
  isForRelated,
  isHidden,
  isIfAll,
  isItemVar,
  iterateObjValue,
  replacePseudo,
  replaceWith,
  splitWith,
  splitWxAttrs,
} from "./reg";

const {
  keys,
  values,
} = Object;
const logger = Logger.getInstance();

/**
 * getFlattenChild
 * @param child
 * @param result
 */
export const getFlattenChild = (
  child: IAst[],
  result: IAst[] = [],
): IAst[] => {
  if (child && child.length) {
    return child.filter(({ node, tag }: IAst) => (
      !is(node, TEXT)
      && !is(tag, INCLUDE_TAG)
      && !is(tag, IMPORT_TAG)
    )).reduce((res: any[], ch: IAst) => {
      const { attr, tag } = ch;
      if (attr && attr.class || is(tag, TEMPLATE_TAG)) {
        res.push(ch);
      } else {
        getFlattenChild(ch.child, res);
      }
      return res;
    }, result);
  }
  return result;
};

/**
 * cachKlassStruct
 * @param klass
 * @param ast
 * @param options
 */
export const cachKlassStruct = (
  klass: string | string[],
  ast: IAst,
  options: IPath,
): void => {
  let { child } = ast;
  const { wxmlStructInfo = {} } = options;
  child = getFlattenChild(child);
  if (isArr(klass)) {
    klass = klass.join(' ');
  }

  if (klass) {
    splitWxAttrs(klass).forEach((kl: string) => {
      if (kl) {
        wxmlStructInfo[kl] = wxmlStructInfo[kl] || [];
        wxmlStructInfo[kl].push(child);
      }
    });
  }
};

/**
 * styleTreeShake
 * @param stylesheet
 * @param options
 */
export const styleTreeShake = (
  rules: css.Rule[],
  options: IPath,
): css.Rule[] => {
  const { wxmlStructInfo, wxmlKlassInfo } = options;
  return rules.filter((
    rule: css.Rule & css.Import,
  ) => {
    const { type, selectors } = rule;
    if (is(type, RULE_TAG)) {
      const newSelectors: string[] = [];
      selectors.forEach((selector: string) => {
        const selectorArr = splitWith(replacePseudo(selector));
        if (hasKlassInStruct(selectorArr, wxmlStructInfo, wxmlKlassInfo)) {
          newSelectors.push(selector);
        }
      });
      if (!newSelectors.length) {
        return false;
      }
      rule.selectors = newSelectors;
    } else if (is(type, COMMENT_TAG)) {
      return false;
    }
    return true;
  }).filter(identity);
};

/**
 * hasChildWithKlass
 * @param selectorList
 * @param child
 * @param transMap
 * @param result
 */
export const hasChildWithKlass = (
  selectorList: string[],
  child: IAst[],
  transMap: ICO,
  result: IAst[] = [],
): IAst[] => {
  return child.reduce((res: IAst[], ch: IAst) => {
    const { attr = {}, tag } = ch;
    const { class: aKlass } = attr;
    if (tag && aKlass) {
      const matchKlass = selectorList.every((selector: string) => {
        if (isStr(aKlass) || isArr(aKlass)) {
          return aKlass.includes(selector);
        }
        return false;
      });
      if (matchKlass) {
        res.push(ch);
      } else {
        hasChildWithKlass(selectorList, ch.child || [], transMap, res);
      }
    } else {
      hasChildWithKlass(selectorList, ch.child || [], transMap, res);
    }
    return res;
  }, result);
};

/**
 * getInterSectSelectorChild
 * @param selector
 * @param klassMap
 * @param transMap
 */
export const getInterSectSelectorChild = (
  selector: string,
  klassMap: ICO,
  transMap: ICO,
): IAst[][] => {
  const temp: IAst[][][] = [];
  const resultSet: Set<IAst[]> = new Set();
  let result: IAst[][] = [];
  let tag: string;
  try {
    replaceWith(selector, /([#\.]?)([^#\.]+)/g, (m, $1, $2): string => {
      if (is($1, '.')) {
        temp.push(klassMap[$2] || []);
      } else if (is($1, '#')) {
        temp.push(klassMap[transMap[m].substr(1)] || []);
      } else {
        tag = $2;
      }
      return m;
    });
  } catch (err) {
    return result;
  }

  const tmpLen = temp.length;
  if (tmpLen) {
    if (tmpLen > 1) {
      for (let i = 0, l = tmpLen; i < l; i += 1) {
        const children = temp[i];
        // find the intersection of all selectors` children
        const child = children[0];
        if (temp.slice(1).every((other: IAst[][]): boolean => other.includes(child))) {
          resultSet.add(child as IAst[]);
        }
      }
    } else {
      return temp[0];
    }
  }

  result = [...resultSet];
  if (tag) {
    result = result.filter((child: IAst[]): boolean => (
      child.some((ch: IAst) => ch && ch.parent && ch.parent.tag === tag)
    ));
  }
  return result;
};

/**
 * hasKlassInStruct
 * @param selectorList
 * @param struct
 * @param klassInfo
 */
export const hasKlassInStruct = (
  selectorList: string[],
  struct: ICO,
  klassInfo: ICO,
): boolean => {
  let nextChildren: IAst[][];
  for (const selector of selectorList) {
    if (!isCssSymbol(selector)) {
      const children = getInterSectSelectorChild(selector, struct, klassInfo);
      if (!children || !children.length) { return false; }
      if (nextChildren) {
        nextChildren = nextChildren.map((child: IAst[]) =>
          hasChildWithKlass(splitWith(selector, /\./), child, klassInfo),
        );
        const combChildren = combine(nextChildren);
        if (!combChildren.length) { return false; }
        continue;
      }
      nextChildren = children;
    } else {
      // TODO resolve .a > .b / .a + .c > .b
    }
  }
  return true;
};

/**
 * getPageData
 * @param input
 */
export const getPageData = (input: string): ICO => {
  let doing: boolean = true;
  let result: ICO;
  const argSet: Set<string> = new Set();
  if (!input) { return result; }
  iterateObjValue(input, (res: string[]) => {
    if (hasObjKey(res[1])) {
      argSet.add(RegExp.$1);
    }
  });
  let fnBody: string = `return ${input};`;
  const argArr = [...argSet];
  if (!argArr.length) { argArr.push('wx'); }
  while (doing) {
    try {
      const getContentFn = new Function(...argArr.concat(fnBody));
      result = getContentFn(
        ...getRepeatArr(argArr.length, wx),
      );
      doing = false;
    } catch ({ message }) {
      if (hasUnDefVariable(message)) {
        fnBody = fnBody.replace(RegExp.$1, '""');
      } else {
        doing = false;
      }
    }
  }
  return result;
};

/**
 * getExecWxml
 * @param content
 * @param wxml
 * @param options
 */
export const getExecWxml = (
  content: string,
  wxml: string,
  options: IPath,
): string => {
  const { isPage } = options;
  let data = getPageData(content);
  if (!data) { return wxml; }
  data = data || {};
  const dataKeyRE = new RegExp(`((?:${keys(data).join('|')}))`, 'g');
  const transWxml = replaceWith(wxml, /((?:[^\s]+\=|))(['"]*)\{\{([^\{\}]+)\}\}(\2)/g, (m, $1, $2, $3, $4) => {
    let result;
    let scanning: boolean = true;
    const isVisibleStyle: boolean = isIfAll($1) || isHidden($1);

    // wx:if or wx:elif or wx:else or hidden
    if (isVisibleStyle) {
      if (isPage) {
        result = `${$1}${$2}\{\{$\{${$3}\}\}\}${$4}`;
      } else if (keys(data).length) {
        result = replaceWith(m, dataKeyRE, (im, i$1) => `$\{${i$1}\}`);
      } else {
        return m;
      }
    } else {
      return m;
    }

    // if error, just return false
    if (true) {
      try {
        new Function(...keys(data) as string[], `return \`${result}\`;`).apply(null, values(data));
      } catch ({ message }) {
        return result.replace($3, 'false');
      }
    // TODO register any undef variable with default value `wx`
    } else {
      while (scanning) {
        try {
          new Function(...keys(data) as string[], `return \`${result}\`;`).apply(null, values(data));
        } catch ({ message }) {
          if (hasUnDefVariable(message)) {
            data[RegExp.$1] = wx;
          } else if (hasUnDefProperty(message)) {
            const parentKeys = getPropTarget(result, RegExp.$1);
            parentKeys.reduce((res: ICO, key: string): ICO => {
              if (!res) { res = wx; }
              if (is(res[key], null) || !isObj(res[key])) {
                res[key] = wx;
              }
              return res[key];
            }, data);
          } else {
            scanning = false;
          }
          continue;
        }
        scanning = false;
      }
    }
    return result;
  });

  try {
    const genVnodeFn = new Function(...keys(data) as string[], `return \`${transWxml}\`;`);
    return genVnodeFn.apply(null, values(data));
  } catch (err) {
    logger.warn(err);
  }
  return wxml;
};

/**
 * wxmlTreeShake
 * @param content
 * @param src
 * @param options
 */
export const wxmlTreeShake = (
  content: string,
  src: string,
  options: IPath,
): string => {
  const srcJs: string = modifySuffix(src, 'js');
  const jsContent: string | void | Promise<any> | Buffer = exists(srcJs) ? read(srcJs) : '';
  if (!jsContent) { return content; }
  const result = transform(jsContent as string) || {};
  const { ast } = result;
  let maxDiff: number[] = [];
  traverse(ast, {
    ObjectProperty(path: NodePath) {
      const node: ICO = path.node;
      const { key, value } = node;
      if (is(key.name, WX_DATA)) {
        const { start, end } = value;
        const isEmptyOrMaxDiff = !maxDiff.length || (end - start > maxDiff[1] - maxDiff[0]);
        if (isEmptyOrMaxDiff) {
          maxDiff = [start, end];
        }
      }
    },
  });
  if (maxDiff.length && maxDiff.every((val: any) => val >= 0)) {
    try {
      const dataString = (jsContent as string).slice(...maxDiff);
      return getExecWxml(dataString, content, options);
    } catch (err) {
      logger.warn(err);
    }
  }
  return content;
};
