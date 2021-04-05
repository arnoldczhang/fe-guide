import postcss, { atRule, AcceptedPlugin } from 'postcss';
import Processor from 'postcss/lib/processor.js';
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
  vueRe,
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
  detectDeep,
  detectImport,
} from './postcss';
import {
  Func,
  Replacer,
  ReplaceLessOption,
} from '../types';

const {
  keys,
} = Object;

// 所有style的信息
const styleCach: Map<string, Record<string, any>> = new Map();

const errorCatchCachProps = errorCatch(cachProps);

const errorCatchReplaceProps = errorCatch(replaceProps);

const errorCatchDetectDeep = errorCatch(detectDeep);

const errorCatchDetectImport = errorCatch(detectImport);

/**
 * 快捷运行postcss
 * @param plugins
 * @param content
 */
const runPostcss = async (
  plugins: AcceptedPlugin[],
  content: string,
  config?: Record<any, any>,
) => {
  const instance = plugins.reduce((res: Processor, plugin) => {
    return res.use(plugin);
  }, postcss());
  return instance.process(content, config || defaultPostcssConfig);
};

/**
 * 替换自定义样式&输出使用情况
 * @param target
 */
export const replaceCommonLess = errorCatchSync(async (
  path: string,
  option: ReplaceLessOption,
) => {
  await replaceContent(path, {
    ...option,
    suffix: option.css,
  }, replaceLessProps);
  await replaceContent(path, {
    ...option,
    suffix: option.vue,
  }, replaceVueProps);
  return styleCach;
});

/**
 * less内容替换，支持跳过部分文件
 */
export const replaceContent = errorCatchSync(async (
  rootPath: string,
  option: ReplaceLessOption & { suffix: RegExp[] },
  traverseFn: Func,
) => {
  const {
    skip = [],
    suffix,
    replacements,
  } = option;

  const targetPaths = readdir(rootPath, { suffix })
    .filter((p: string) =>
      !skip.some((re) => re.test(p))
    );

  await Promise.all(targetPaths.map((path) => {
    success(`now analyse: ${path}`);
    return traverseFn(path, replacements);
  }));

  return styleCach;
});

/**
 * 分析.vue/.less中的样式、class、less变量等使用情况
 */
export const analyseLessUsage = errorCatchSync(async (
  path: string,
  option: {
    css: RegExp[];
    vue: RegExp[];
  }
) => {
  const { css, vue } = option;
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
) => {
  const targetPaths = readdir(rootPath, { suffix });
  await Promise.all(targetPaths.map((path) => {
    success(`now analyse: ${path}`);
    return traverseFn(path);
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
    const { attrs = {}, content: styleContent } = style;
    const { scoped, lang } = attrs;
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
    styleCompressPath,
    attrPath,
    attrCompressPath,
  }: {
    stylePath?: string;
    styleCompressPath?: string;
    attrPath?: string;
    attrCompressPath?: string;
  },
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
  if (stylePath) {
    await drawDependencyImage(stylePath, {
      node: styleTreeNode,
      compressPath: styleCompressPath,
    });
  }
  // 画样式属性树
  if (attrPath) {
    await drawDependencyImage(attrPath, {
      node: attributeTreeNode,
      compressPath: attrCompressPath,
    });
  }
});

/**
 * 替换.less中自定义样式
 */
export const replaceLessProps = errorCatchSync(async (
  path: string,
  replacements: Replacer[],
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
  replacements: Replacer[],
) => {
  const content = read(path);
  if (!content) return;
  const { script = {}, template, styles } =  parseVue(content, { deindent: false });
  if (!styles || !styles.length) return;
  // .vue可能有多个style块（scoped或非scoped），要分别处理
  const result: string[] = await Promise.all(styles.map(async (style: SFCBlock) => {
    const { attrs = {}, content: styleContent } = style;
    const { lang } = attrs;
    const isBlankOrNotLess = isBlankContent(styleContent) || lang !== 'less';
    if (isBlankOrNotLess) return Promise.resolve(styleContent);
    return postcss()
      .use(errorCatchReplaceProps(replacements))
      .process(styleContent, defaultPostcssConfig)
      .css;
  }));
  const styleContent = result.map((
    content: string,
    index: number,
  ): string => `<style${concatObjectKeyValue(styles[index].attrs)}>${content}</style>`).join('\n');
  const scriptContent = script ? `<script${concatObjectKeyValue(script.attrs)}>${script.content}</script>` : '';
  write(path, `${template}\n${scriptContent}\n${styleContent}`);
});

/**
 * 检测.vue中的非scoped的deep
 */
export const detectDeepWithScoped = errorCatch(async (
  rootPath: string,
  skip: RegExp[],
): Promise<string[]> => {
  const result: string[] = [];
  const targetPaths = readdir(rootPath, { suffix: [vueRe] })
    .filter((p: string) =>
      !skip.some((re) => re.test(p))
    );

  await Promise.all(targetPaths.map(async (path: string) => {
    const content = read(path);
    if (!content) return;
    const { styles } =  parseVue(content);
    if (!styles || !styles.length) return;
    await Promise.all(styles.map(async (style: SFCBlock) => {
      const { attrs = {} } = style;
      let { content: styleContent } = style;
      const { scoped, lang, src } = attrs;
      if (src) {
        path = nodePath.resolve(path, '..', src);
        styleContent = read(path);
      }
      const isBlankOrNotLess = isBlankContent(styleContent) || lang !== 'less';
      if (isBlankOrNotLess) return;
      // 将所有@import合并到当前style代码中
      await runPostcss([
        errorCatchDetectImport((url: string) => {
          styleContent = read(nodePath.resolve(path, '..', url)) + styleContent;
        }),
      ], styleContent);
      // 查找非scoped中使用deep的情况和scoped中的嵌套deep
      return runPostcss([
        errorCatchDetectDeep(scoped, () => {
          if (result.includes(path)) {
            return;
          }
          result.push(path);
        }),
      ], styleContent);
    }));
  }));
  debugger;
  return result;
});