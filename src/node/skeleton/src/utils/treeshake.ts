import * as css from 'css';
import { COMMENT_TAG, IMPORT_TAG, INCLUDE_TAG, RULE_TAG, TEMPLATE_TAG, TEXT } from "../config";
import { IAst, ICO, IPath } from "../types";
import { is, isArr, isStr } from "./assert";
import { identity } from './dir';
import { replacePseudo, splitWxAttrs } from "./reg";

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

  splitWxAttrs(klass).forEach((kl: string) => {
    if (kl) {
      wxmlStructInfo[kl] = wxmlStructInfo[kl] || [];
      wxmlStructInfo[kl].push(child);
    }
  });
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
  const { wxmlStructInfo } = options;
  return rules.filter((
    rule: css.Rule & css.Import,
  ) => {
    const { type, selectors } = rule;
    const newSelectors: string[] = [];

    if (is(type, RULE_TAG)) {
      selectors.forEach((selector: string) => {
        const selectorArr = replacePseudo(selector).split(/\s+/);
        if (hasKlassInStruct(selectorArr, wxmlStructInfo)) {
          newSelectors.push(selector);
        }
      });
    } else if (is(type, COMMENT_TAG)) {
      return false;
    }

    if (!newSelectors.length) {
      return false;
    }
    rule.selectors = newSelectors;
    return true;
  }).filter(identity);
};

export const hasChildWithKlass = (
  klass: string,
  child: IAst[],
  result: IAst[] = [],
): IAst[] => {
  return child.reduce((res: IAst[], ch: IAst) => {
    const { attr = {}, tag } = ch;
    // if (attr.class) {

    // }
    return res;
  }, result);
};

/**
 * hasKlassInStruct
 * @param klassList
 * @param struct
 */
export const hasKlassInStruct = (
  klassList: string[],
  struct: ICO,
): boolean => {
  let nextChildren: ICO[];
  for (let klass of klassList) {
    klass = klass.replace('.', '');
    if (!is(klass, '>')) {
      const children = struct[klass];
      if (!children) { return false; }
      if (nextChildren) {
        debugger;
        nextChildren = hasChildWithKlass(klass, nextChildren);
        if (!nextChildren) { return false; }
        continue;
      }
      nextChildren = children;
    }
  }
  return true;
};
