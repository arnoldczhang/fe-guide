import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import {
  Root,
  Container,
  Rule,
  AtRule,
} from 'postcss';
import { VueResult, Plugin } from '../types';
import {
  CSS_AT_RULE,
} from './const';
import {
  error,
  warn,
  success,
} from './logger';
import {
  hook,
  HOOK_NAME,
} from './hook';

/**
 * 通用抛错
 * @param result
 * @param msg
 * @param force
 */
export const assert = (
  result: boolean,
  msg: string,
  force = true,
) => {
  if (!result) {
    if (force) {
      throw new Error(msg);
    }
    warn(msg);
  }
};

export const isType = (
  val: any,
  type: string,
): boolean => typeof val === type;

export const genHash = (length = Number.MAX_SAFE_INTEGER) =>
  Math.random().toString(36).slice(2).slice(0, length);

export const isFunc = (val: any) => isType(val, 'function');

export const isStr = (val: any) => isType(val, 'string');

export const isUndef = (val: any) => isType(val, 'undefined');

export const isRe = (val: any) => val instanceof RegExp;

export const isObj = (val: any) => Object.prototype.toString.call(val) === '[object Object]';

export const isDeclaration = (input: string): boolean =>
  /\.d\.ts$/.test(input)
;

export const isTypescript = (input: string): boolean =>
  /\.tsx?$/.test(input)
;

export const isRelativePath = (path: string): boolean =>
  /^\.{1,2}\//.test(path)
;

export const isNullStr = (val: any): boolean =>
  val === null || val === undefined || val === ''
;

/**
 * 无内容或内容为类空字符
 * @param content
 */
export const isBlankContent = (content: string): boolean =>
  !content || /^[\s↵]+$/.test(content)
;
export const replaceImport = (
  value: string,
  path: string,
): string => value.replace(/~?@\//, `${path}/`);

/**
 * 处理babel-ast时，骗ts的常规手段
 * @param value
 */
export const getOnly = (
  value: NodePath<t.Node> | NodePath<t.Node>[],
): NodePath<t.Node> => {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
};

/**
 * 驼峰转-
 * @param letter
 */
export const toLineLetter = (
  letter: string,
): string => letter.replace(/(.)([A-Z])/g, '$1-$2').toLowerCase();

/**
 * 解析成vuepress所需要的默认结构
 */
export const genVueResult = (): VueResult => ({
  import: new Map(),
  component: new Map(),
  data: new Map(),
  prop: new Map(),
  src: '',
  template: new Map(),
});

/**
 * 异常捕获
 * @param fn
 * @param fnName
 */
export const errorCatch = (
  fn: any,
  fnName?: string,
): any => {
  let message = 'fn必须是function';
  if (isFunc(fn)) {
    return (...args: any[]) => {
      try {
        return fn(...args);
      } catch (err) {
        message = `捕获异常：${fnName || fn.name} -> ${err.message}`;
        error(message);
      }
    };
  }
  error(message);
};

/**
 * 异步异常捕获
 * @param fn
 */
export const errorCatchSync = (fn: any): any => {
  let message = 'fn必须是function';
  if (isFunc(fn)) {
    return async (...args: any[]) => {
      try {
        const result = await fn(...args);
        return result;
      } catch (err) {
        message = `捕获异常：${fn.name} -> ${err.message}`;
        error(message);
      }
    };
  }
  error(message);
};

/**
 * .vue文件名转vuepress标题名
 * @param path
 * @param name
 */
export const getVuepressCompName = (
  path: string,
  name: string,
) => name
  .replace(`${path}/`, '')
  .replace(/\//g, '-')
  .replace(/\.vue$/, '');

/**
 * 递归获取postcss的上层selector
 * @param container
 * @param result
 */
export const getDeclSelector = (
  container?: Container | Root | AtRule | Rule,
  result = '',
): string => {
  if (!container) return result;
  if (
    !(container instanceof Rule)
      && !(container instanceof AtRule)
  ) return result;

  const { parent } = container;

  if (container instanceof Rule) {
    const { selector } = container;
    result = result ? result.replace(/&/g, selector) : selector;
  }

  if (container instanceof AtRule) {
    const { name, params } = container;
    result = `@${name} ${params} ${result}`;
  }

  return getDeclSelector(parent, result);
};

/**
 * 将多个selector分割为数组
 *
 * 注：less运算函数跳过处理
 *
 * @param selector
 */
export const getSplitSelector = (
  selector: string,
): string[] => /[\(\)]/.test(selector) ? [selector] : selector.split(/,[↵\s+]/);

/**
 * 判断是否为css原生@
 * @param rule
 */
export const isCssAtRule = (
  rule: string,
): boolean => {
  return CSS_AT_RULE.some((cssRule: string | RegExp) => {
    if (cssRule instanceof RegExp) {
      return cssRule.test(rule);
    }
    return cssRule === rule;
  });
};

/**
 * 将对象key-value拼接为string输出
 * @param input
 */
export const concatObjectKeyValue = (
  input: Record<string, any>,
): string => Object.entries(input).reduce((res, pre) => {
  const [key, value] = pre;
  res += ` ${key}="${value}"`;
  return res;
}, '').trim();

/**
 * 注册插件
 * @param plugin
 */
export const registerPlugins = (plugins: Plugin[]) => {
  assert(Array.isArray(plugins), '类型参考{ plugin: Plugin[] }');
  plugins.forEach((plugin) => {
    if (plugin && isFunc(plugin.install)) {
      plugin.install(hook, HOOK_NAME, {
        error,
        warn,
        success,
      });
    }
  });
};

/**
 * readme模板中对各类型数据值的还原处理
 */
const typeEval: Record<string, string> = {
  Array: '(val => eval(val))',
  Object: '(val => eval("(" + val + ")"))',
  String: '(val => val)',
  Boolean: '(val => eval(val))',
  Number: '(val => Number(val))',
  Function: '(val => eval("(" + val + ")"))',
};

/**
 * 生成readme模板
 * @param param0
 */
export const getReadmeTemplate = ({
  title,
  path,
  name,
  prop,
  parent,
}: {
  title: string;
  path: string[];
  name: string;
  prop: Map<string, any>;
  parent: Set<Record<string, any>>;
}) => {
  const keys = [...prop.keys()];
  //
  const keyPropsRaw = keys.map((key) => {
    const { default: value } = prop.get(key);
    return `
      ${key}: ${
  isNullStr(value)
    ? null
    : typeof value === 'object'
      ? JSON.stringify(value)
      : value
}`;
  });
  //
  const keyProps = keys.map((key) => {
    const { default: value } = prop.get(key);
    let finalValue = value;

    if (isNullStr(value)) {
      finalValue = '""';
    }

    while (!/^['"]/.test(finalValue)) {
      finalValue = JSON.stringify(finalValue);
    }

    return `
      ${key}: ${finalValue}`;
  });
  //
  const keyTypes = keys.map((key) => {
    const { type } = prop.get(key);
    return `
    ${key}: ${typeEval[type] || typeEval.Object}`;
  });
  //
  const [pathTitle, originPath] = path;
  return `# ${title}
## 我在哪
  [${pathTitle}](${originPath})
## 试一试
<${name} ${
  keys.map(key => `
  :${key}="${key}"`).join('')
}/>
${
  keys.map(key => `
<el-input
        v-model="model.${key}"
        style="margin-top: 10px;"
      ><template slot="prepend">${key}:</template></el-input>`).join('')
}
<script>
let timeout = null;
const keyTypes = {${keyTypes}
};
export default {
  watch: {
    model: {
      deep: true,
      async handler(val) {
        if (timeout) {
          clearTimeout(timeout);
        }
        timeout = setTimeout(() => {
          Object.keys(val).forEach((key) => {
            this[key] = keyTypes[key](val[key]);
          });
        }, 1000);
      }
    },
  },
  data() {
    return {
      model: {
        ${keyProps}
      },
      ${keyPropsRaw}
    };
  }
}
</script>
## 哪在用
${[...parent].map(({
    relativePath,
    originPath,
    usage,
  }) => `### [${relativePath}](${originPath})
\`\`\`html
${Object.keys(usage).map((key) => {
    const value = usage[key];
    if (value && value.size) {
      return [...value].map(val => val || '组件没用到或者以动态components方式使用').join('\n');
    }
    return '';
  }).join('\n')}
\`\`\`
`).join('\n')}
`;
};