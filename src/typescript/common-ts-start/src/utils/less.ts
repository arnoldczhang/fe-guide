import postcss from 'postcss';
import * as nodePath from 'path';
import { SFCBlock } from 'vue-template-compiler';
import {
  read,
  write,
  readdir,
} from './fs';
import {
  errorCatch,
  errorCatchSync,
  isBlankContent,
  concatObjectKeyValue,
} from './helper';
import {
  defaultPostcssConfig,
} from './const';
import {
  drawDependencyImage,
} from './tree';
import {
  parseVue,
} from './transfer';
import { success } from './logger';
import {
  cachProps,
  replaceProps,
} from './postcss';
import {
  Func,
  StyleReplacer,
} from '../../types';

const {
  keys,
} = Object;

// 所有style的信息
const styleCach = new Map();

const errorCatchCachProps = errorCatch(cachProps);

const errorCatchReplaceProps = errorCatch(replaceProps);

/**
 * 分析.vue/.less中的样式、class、less变量等使用情况
 */
export const analyseLessUsage = errorCatchSync(async (
  path: string,
  reOptions: {
    css: RegExp[];
    vue: RegExp[];
  }
) => {
  const { css, vue } = reOptions;
  await analyseLessContent(path, css, cachLessProps);
  await analyseLessContent(path, vue, cachVueProps);
  return styleCach;
});

/**
 * 从根路径搜索含less的文件（.vue/.less）做相应处理
 */
export const analyseLessContent = errorCatchSync(async (
  rootPath: string,
  suffix: RegExp[],
  traverseFn: Func,
  ...args: any[]
) => {
  const targetPaths = readdir(rootPath, { suffix });
  await Promise.all(targetPaths.map((path) => {
    success(`now analyse: ${path}`);
    return traverseFn(path, ...args);
  }));
  return styleCach;
});

/**
 * 缓存.less中的less
 */
const cachLessProps = errorCatchSync(async (
  path: string,
) => {
  let result: Record<string, any> = {};
  const content = read(path);
  if (!content) return result;
  await postcss().use(errorCatchCachProps((info: Record<string, any>) => {
    styleCach.set(path, info);
    result = info;
  })).process(content, defaultPostcssConfig);
  return result;
});

/**
 * 缓存.vue中的less
 */
const cachVueProps = errorCatchSync(async (
  path: string,
) => {
  const result: Record<string, any>[] = [];
  const content = read(path);
  if (!content) return result;
  const { styles } =  parseVue(content);
  if (!styles || !styles.length) return;
  // .vue可能有多个style块（scoped或非scoped），要分别处理
  await Promise.all(styles.map(async (style: SFCBlock) => {
    const { attrs: { scoped, lang }, content: styleContent } = style;
    const isBlankOrNotLess = isBlankContent(styleContent) || lang !== 'less';
    if (isBlankOrNotLess) return Promise.resolve('');
    return postcss().use(errorCatchCachProps((info: Record<string, any>) => {
      const newValue = styleCach.get(path) || [];
      info.scoped = !!scoped;
      newValue.push(info);
      result.push(info);
      styleCach.set(path, newValue);
    })).process(styleContent, defaultPostcssConfig);
  }));
  return result;
});

/**
 * 画属性树、样式树
 */
export const genLessUsageTree = errorCatchSync(async (
  root: string,
  {
    stylePath,
    attrPath,
  }: { stylePath: string; attrPath: string; },
) => {
  const preParseAttrValue = (attr: any): string => attr.replace(/"/g, '\\"');
  // 样式树
  const styleTreeNode: Record<string, string[]> = {};
  // 样式属性树
  const attributeTreeNode: Record<string, string[]> = {};
  styleCach.forEach((
    lessArray: Record<string, any> | Record<string, any>[],
    path: string,
  ) => {
    path = path.replace(root, '@');
    const styleSet: Set<string> = new Set();
    const attributeSet: Set<string> = new Set();
    if (!Array.isArray(lessArray)) {
      lessArray = [lessArray];
    }
    lessArray.forEach((less: Record<string, any>) => {
      keys(less).forEach((selector: string) => {
        // 只处理真正的样式声明
        if (typeof less[selector] === 'object') {
          const style = less[selector];
          Object.entries(style).forEach(([key, value]) => {
            value = preParseAttrValue(value);
            styleSet.add(`${key}:${value}`);
            attributeSet.add(value as string);
          });
        }
      });
    });

    if (styleSet.size) {
      styleTreeNode[path] = [...styleSet];
    }

    if (attributeSet.size) {
      attributeTreeNode[path] = [...attributeSet];
    }
  });
  // 画样式树
  await drawDependencyImage(stylePath, {
    node: styleTreeNode,
  });
  // 画样式属性树
  await drawDependencyImage(attrPath, {
    node: attributeTreeNode,
  });
});

/**
 * 替换自定义样式&输出使用情况
 * @param target
 */
export const replaceCommonLess = errorCatchSync(async (
  path: string,
  options: {
    css: RegExp[];
    vue: RegExp[];
    replacements: StyleReplacer[],
  }
) => {
  const { css, vue, replacements } = options;
  await analyseLessContent(path, css, replaceLessProps, replacements);
  await analyseLessContent(path, vue, replaceVueProps, replacements);
  const result: Record<string, any> = await analyseTargetLessUsage(replacements);
  return result;
});

/**
 * 替换自定义样式&输出使用情况
 * @param target
 */
export const analyseTargetLessUsage = errorCatchSync(async (
  replacements: StyleReplacer[],
) => {
  const result: Record<string, any> = {};
  styleCach.forEach((
    lessArray: Record<string, any> | Record<string, any>[],
    path: string,
  ) => {
    if (!Array.isArray(lessArray)) {
      lessArray = [lessArray];
    }
    lessArray.forEach((less: Record<string, any>) => {
      keys(less).forEach((selector: string) => {
        if (typeof less[selector] === 'object') {
          const style = less[selector];
          const matched = replacements.reduce((
            res: Record<string, any>,
            pre: { key: string; value: string; },
          ) => {
            const { key, value } = pre;
            if (style[key] === value) {
              res[key] = value;
            }
            return res;
          }, {});

          if (keys(matched).length) {
            result[path] = result[path] || {};
            result[path][selector] = matched;
          }
        }
      });
    });
  });
  return result;
});

/**
 * 替换.less中自定义样式
 */
export const replaceLessProps = errorCatchSync(async (
  path: string,
  replacements: StyleReplacer[],
) => {
  const content = read(path);
  if (!content) return;
  const { css } = await postcss()
    .use(errorCatchReplaceProps(replacements))
    .process(content, defaultPostcssConfig);
  if (content !== css) {
    write(path, css);
  }
});

/**
 * 替换.vue中自定义样式
 */
export const replaceVueProps = errorCatchSync(async (
  path: string,
  replacements: StyleReplacer[],
) => {
  const content = read(path);
  if (!content) return;
  const { script, template, styles } =  parseVue(content);
  if (!styles || !styles.length) return;
  // .vue可能有多个style块（scoped或非scoped），要分别处理
  const result: string[] = await Promise.all(styles.map(async (style: SFCBlock) => {
    const { attrs: { lang }, content: styleContent } = style;
    const isBlankOrNotLess = isBlankContent(styleContent) || lang !== 'less';
    if (isBlankOrNotLess) return Promise.resolve(styleContent);
    return postcss()
      .use(errorCatchReplaceProps(replacements))
      .process(styleContent, defaultPostcssConfig)
      .css;
  }));
  //
  const styleContent = result.map((
    content: string,
    index: number,
  ): string => `<style ${concatObjectKeyValue(styles[index].attrs)}>${content}</style>`).join('\n');
  const scriptContent = `<script ${concatObjectKeyValue(script.attrs)}>${script.content}</script>`;
  write(path, `${template}\n${scriptContent}\n${styleContent}`);
});
