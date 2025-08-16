import { Root, Declaration, AtRule, Rule } from 'postcss';
import postcssSelectorParser from 'postcss-selector-parser';
import {
  Func,
  Replacer,
} from '../types';
import {
  getSplitSelector,
  getDeclSelector,
  isCssAtRule,
} from './helper';

/**
 * 缓存选择器及其属性
 * @param callback
 */
export function cachProps(callback: Func) {
  const cach = new WeakMap();
  return {
    postcssPlugin: 'postcss-plugin-cach-props',
    OnceExit(css: Root) {
      const info: Record<string, any> = {};
      // 递归 atRule 主要为了获取已有less变量，然后看是否有复用可能性
      css.walkAtRules((atRule: AtRule) => {
        const { name, params } = atRule;
        const key = `@${name}`;
        // 仅读取less变量
        if (isCssAtRule(key)) return;
        info[key] = params;
      });
      css.walkDecls((decl: Declaration) => {
        const { parent, prop, value } = decl;
        if (!parent) return;
        const selector: string = cach.get(parent) || getDeclSelector(parent);
        getSplitSelector(selector).forEach((key: string) => {
          info[key] = info[key] || {};
          info[key][prop] = value;
        });
        cach.set(parent, selector);
      });
      callback(info);
    },
  };
}

/**
 * 替换特定选择器对应的属性
 * @param replacements
 */
export function replaceProps(
  replacements: Replacer[],
) {
  return {
    postcssPlugin: 'postcss-plugin-replace-props',
    OnceExit(css: Root) {
      css.walkDecls((decl: Declaration) => {
        const { prop, value } = decl;
        const existed = replacements.filter((replacement) => {
          const { target } = replacement;
          if (Array.isArray(target)) {
            const [scope, targetValue] = target;
            if (targetValue !== value) return false;
            if (typeof scope === 'string') {
              return prop === scope;
            }
            return scope.test(prop);
          }

          if (target instanceof RegExp) {
            return target.test(value);
          }

          return value === target;
        });

        if (existed.length) {
          decl.value = existed.reduce((res, pre) => {
            const { target, replacer } = pre;
            if (Array.isArray(target)) {
              const [, targetValue] = target;
              return res.replace(targetValue, replacer);
            }
            return res.replace(target, replacer);
          }, value);
        }
      });
    },
  };
}

/**
 * 检测less中的deep（/deep/、::v-deep、>>>）
 *
 * - 非scoped禁止deep
 * - scoped禁止嵌套deep
 *
 * @param callback
 */
export function detectDeep(
  scoped: boolean,
  callback: Func,
) {
  return {
    postcssPlugin: 'postcss-plugin-detect-deep',
    OnceExit(css: Root) {
      const cach = new WeakSet();
      let passed = true;
      css.walkRules((rule: Rule) => {
        if (!passed) {
          return passed;
        }

        postcssSelectorParser((selectors) => {
          selectors.each((selector) => {
            selector.each((node: any) => {
              const isCombDeep = node.type === 'combinator' && (node.value === '>>>' || node.value === '/deep/');
              const isPseuDeep = node.type === 'pseudo' && node.value === '::v-deep';
              if (isCombDeep || isPseuDeep) {
                // 非scoped禁止deep
                if (!scoped) {
                  callback();
                  passed =false;
                  return passed;
                // scoped禁止嵌套deep
                } else {
                  let parent = rule.parent;

                  while (parent) {
                    if (cach.has(parent)) {
                      callback();
                      passed =false;
                      return passed;
                    }
                    parent = parent.parent;
                  }
                  cach.add(rule);
                }
              }
            });
          });
        }).processSync(rule.selector);
      });
    },
  };
}

/**
 * 查找less中的`@import`
 * @param iterateDetect
 */
export function detectImport(
  callback: Func,
) {
  return {
    postcssPlugin: 'postcss-plugin-detect-deep',
    OnceExit(css: Root) {
      css.walkAtRules((atRule: AtRule) => {
        const { name, params } = atRule;
        if (name === 'import') {
          callback(params.replace(/(^['"]|['"$])/g, ''));
        }
      });
    },
  };
}
