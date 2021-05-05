import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import {
  Root,
  Container,
  Rule,
  AtRule,
} from 'postcss';
import {
  getAuthor,
} from './git';
import {
  exist,
  cleardir,
  mkdir,
} from './fs';
import {
  VueResult,
  Plugin,
  ReadmeInput,
  ModuleInfo,
  CompResult,
  ErrorOption,
} from '../types';
import {
  CSS_AT_RULE,
  defaultModuleInfoKey,
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
 * 校验外部配置文件格式是否符合规范
 * @param content
 */
export const checkConfigContentValid = (
  config: Record<string, ModuleInfo>,
) => {
  try {
    return Object.keys(config).every((key) => {
      const value = config[key];
      if (typeof value === 'object') {
        return defaultModuleInfoKey.every((k) => k in value);
      }
      return false;
    }) ? config : {};
  } catch(e) {
    return {};
  }
};

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
 *
 * 返回node
 *
 * @param value
 */
export const getOnly = (
  value: NodePath<t.Node> | NodePath<t.Node>[],
): t.Node => {
  if (Array.isArray(value)) {
    return value[0].node;
  }
  return value.node;
};

/**
 * 处理babel-ast时，骗ts的常规手段
 *
 * 返回nodepath
 *
 * @param value
 */
export const getOnlyNodePath = (
  value: NodePath<t.Node> | NodePath<t.Node>[],
): NodePath<t.Node> => {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
};

/**
 * getOnly结果转String
 * @param value
 */
export const getOnlyStr = (
  value: NodePath<t.Node> | NodePath<t.Node>[],
): string => String(getOnly(value));

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
  template: new Map(),
  location: new Map(),
  author: [],
  path: '',
  name: '',
});

/**
 * 解析成vue组件所需要的默认结构
 */
export const genCompResult = (): Set<CompResult> => new Set();

/**
 * 配置文件结构
 */
export const genConfigStruct = (): ModuleInfo => ({
  name: '',
  nameCh: '',
  path: '',
  author: [],
  category: '',
  description: '',
  avatar: '',
  default: {},
  version: '',
  keyword: '',
});

/**
 * 异常捕获
 * @param fn
 * @param fnName
 */
export const errorCatch = (
  fn: any,
  option?: ErrorOption,
): any => {
  const { fnName = '', quiet } = option || {};
  let message = 'fn必须是function';
  if (isFunc(fn)) {
    return (...args: any[]) => {
      try {
        return fn(...args);
      } catch (err) {
        message = `捕获异常：${fnName || fn.name} -> ${err.message}`;
        if (!quiet) {
          error(message);
        }
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
 * 起md文件名
 * @param path
 */
export const genVuepressMdName = (
  path: string,
) => {
  try {
    if (exist(path)) {
      path = path.replace(/\.md/, `-${genHash(4)}.md`);
    }
  } catch(err) {} finally {
    return path;
  }
};

/**
 * 更加组件分类生成目录
 * @param parent
 * @param category
 */
export const genCategoryPath = (
  parent: string,
  category: string | any[],
) => {
  let parentPath = parent;
  // 如果是多级子分类，需要依序清空，重建目录，以防旧文件影响
  if (Array.isArray(category)) {
    category.forEach((cate) => {
      if (isStr(cate)) {
        parentPath = `${parentPath}/${cate}`;
        mkdir(parentPath);
      }
    });
  } else {
    parentPath = `${parent}/${category}`;
    mkdir(parentPath);
  }
  return parentPath;
};

/**
 * 起组件名
 * @param comp
 * @param parent
 */
export const genVuepressCompTitle = (
  comp: { data: Map<string, string> },
  parent: Set<CompResult>,
) => {
  const { data } = comp;
  let title = data.get('name') || '';
  // 如果组件未设置name，从引用处获取第一个importName
  if (!title && parent.size) {
    const [{
      usage,
    }] = [...parent];
    title = Object.keys(usage)[0];
  }
  return title.replace(/(?:^['"]|['"]$)/g, '');
};

/**
 * .vue文件名转vuepress标题名
 * @param path
 * @param name
 */
export const genVuepressCompName = (
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
 * 获取作者
 * @param from
 * @param to
 * @param filePath
 */
export const getFileAuthor = (
  from: string,
  to: string,
  filePath: string,
) => [...new Set(getAuthor(from, filePath.replace(to, from)).split(/\n+/))];

/**
 * 将多个selector分割为数组
 *
 * 注：less运算函数跳过处理
 *
 * @param selector
 */
export const getSplitSelector = (
  selector: string,
): string[] => /[\(\)]/.test(selector) ? [selector] : selector.split(/,[↵\s]*/);

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
  res += String(value) === 'true' ? ` ${key}` : ` ${key}="${value}"`;
  return res;
}, '');

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
  array: '(val => eval(val))',
  ['TSArrayType'.toLowerCase()]: '(val => eval(val))',
  object: '(val => eval("(" + val + ")"))',
  string: '(val => val)',
  ['TSStringKeyword'.toLowerCase()]: '(val => val)',
  boolean: '(val => eval(val))',
  ['TSBooleanKeyword'.toLowerCase()]: '(val => eval(val))',
  number: '(val => Number(val))',
  ['TSNumberKeyword'.toLocaleLowerCase()]: '(val => Number(val))',
  function: '(val => eval("(" + val + ")"))',
};

/**
 * 生成开发人员模板
 * @param author
 */
export const genAuthorTemplate = (
  author: string[],
) => `### 开发人员
${author.map((au) => {
    return `<a target="_blank" style="margin-right: 10px" href="=${au}" >
      <img style="height: 16px;margin-right: 5px" src=""/>${au}
</a>`;
  }).join('\n')}`;

/**
 * 获取模板出现的行数
 * @param usage
 * @param location
 */
export const getUsageLine = (
  usage: Record<string, any>,
  location: Map<string, number[]>,
) => {
  const tpl = Object.keys(usage).reduce((res, key) => {
    if (res || !usage[key]) {
      return res;
    }

    if (usage[key].size) {
      return [...usage[key]][0];
    }
    return res;
  }, '');

  if (tpl && location.get(tpl)) {
    const [start, end] = location.get(tpl) as number[];
    return `L${start}-${end}`;
  }

  return '';
};

/**
 * 生成【哪在用】模板
 * @param parent
 */
export const genUsageTemplate = (
  parent: Set<Record<string, any>>
) => {
  return `
## 使用情况

### 使用文件
${parent.size || 0}个

### 哪在用

${[...parent].map(({
    relativePath,
    originPath,
    gitlabPath,
    usage,
    location,
  }) => {
    const line = getUsageLine(usage, location);
    const href = gitlabPath ? `${gitlabPath}#${line}` : originPath;
    return `
### <a target="_blank" href="${href}">${relativePath}</a>

\`\`\`html
${
  Object.keys(usage).map((key) => {
    const value = usage[key];
    if (value && value.size) {
      return [...value].map(val => val || '组件没用到或者以动态components方式使用').join('\n');
    }
    return '';
  }).join('\n')}
\`\`\`
    `;
  }).join('\n')}
  `;
};

/**
 * 生成readme模板
 * @param param0
 */
export const genReadmeTemplate = ({
  title,
  path,
  name,
  compInfo,
  localConfig,
  parent,
}: ReadmeInput) => {
  const { default: defaultProp = {} } = localConfig;
  const { prop, author = [] } = compInfo;
  const keys = [...prop.keys()];
  const singleQuotaRe = /^['"]/;
  // 组件真实prop
  const keyPropsRaw = keys.map((key) => {
    let { default: value } = prop.get(key);
    const { type  } = prop.get(key);

    if (key in defaultProp) {
      value = defaultProp[key];
    }

    if (isNullStr(value)) {
      value = null;
    } else if (typeof value === 'object') {
      value = JSON.stringify(value);
    } else if (type === 'Function') {
      value = String(value);
    // 非数字
    } else if (isNaN(Number(value))) {
      // 非boolean
      if (value !== 'true' && value !== 'false' && !singleQuotaRe.test(value)) {
        value = JSON.stringify(value);
      }
    }

    return `
      ${key}: ${value}`;
  });

  // 输入框绑定值
  const keyProps = keys.map((key) => {
    let { default: value } = prop.get(key);

    if (key in defaultProp) {
      value = defaultProp[key];
    }

    const type = typeof value;
    if (isNullStr(value)) {
      value = '""';
    } else if (type === 'function') {
      value = String(value);
    } else {
      while (!singleQuotaRe.test(value)) {
        value = JSON.stringify(value);
      }
    }

    return `
      ${key}: ${value}`;
  });
  // 值转换类型
  const keyTypes = keys.map((key) => {
    const { type = '' } = prop.get(key);
    return `
    ${key}: ${typeEval[type.toLowerCase()] || typeEval.object}`;
  });
  //
  const [pathTitle, originPath, gitlabPath] = path;
  return `# ${title}

## 我是谁
<a target="_blank" href="${gitlabPath || originPath}">${pathTitle}</a>

${genAuthorTemplate(author)}

---

## 试一试
<div style="position: relative">
<${name} ${
  keys.map(key => `
  :${key}="${key}"`).join('')
}/>
</div>
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

---

${genUsageTemplate(parent)}
`;
};