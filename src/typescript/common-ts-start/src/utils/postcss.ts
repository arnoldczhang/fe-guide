import { Root, Declaration, AtRule } from 'postcss';
import {
  Func,
  StyleReplacer,
} from '../types';
import {
  getSplitSelector,
  getDeclSelector,
} from './helper';

/**
 * 缓存选择器及其属性
 * @param callback
 */
export function cachProps(callback: Func) {
  const cach = new WeakMap();
  return {
    postcssPlugin: 'postcss-cachProps',
    OnceExit(css: Root) {
      const info: Record<string, any> = {};
      // 递归 atRule 主要为了获取已有less变量，然后看是否有复用可能性
      css.walkAtRules((atRule: AtRule) => {
        const { name, params, nodes } = atRule;
        const key = `@${name}`;
        // 读取纯定义less变量（类似@keyframes，仍属于css范畴）
        if (!nodes || !nodes.length) {
          info[key] = params;
        }
      });
      css.walkDecls((decl: Declaration) => {
        const { parent, prop, value } = decl;
        if (!parent) return;
        const selector: string = cach.get(parent) || getDeclSelector(parent);
        getSplitSelector(selector).forEach((item: string) => {
          info[item] = info[item] || {};
          info[item][prop] = value;
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
  replacements: StyleReplacer[],
) {
  return {
    postcssPlugin: 'postcss-cachProps',
    OnceExit(css: Root) {
      css.walkDecls((decl: Declaration) => {
        const { prop, value } = decl;
        const existed = replacements.find(
          replacement => replacement.key === prop
            && replacement.value === value
        );

        if (existed) {
          decl.value = existed.replacer;
        }
      });
    },
  };
}
