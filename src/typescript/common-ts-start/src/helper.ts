import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import { VueResult, Tree } from './types';
import { write } from './fs';

export const isType = (
  val: any,
  type: string,
): boolean => typeof val === type;

export const genHash = (length = Number.MAX_SAFE_INTEGER) =>
  Math.random().toString(36).slice(2).slice(0, length);

export const isFunc = (val: any) => isType(val, 'function');

export const isStr = (val: any) => isType(val, 'string');

export const isRe = (val: any) => val instanceof RegExp;

export const errorCatch = (
  fn: any,
  fnName?: string,
): any => {
  if (isFunc(fn)) {
    return (...args: any[]) => {
      try {
        return fn(...args);
      } catch (err) {
        throw new Error(`捕获异常：${fnName || fn.name} -> ${err.message}`);
      }
    };
  }
  throw new Error('fn必须是function');
};

export const errorCatchSync = (fn: any): any => {
  if (isFunc(fn)) {
    return async (...args: any[]) => {
      try {
        const result = await fn(...args);
        return result;
      } catch (err) {
        throw new Error(`捕获异常：${fn.name} -> ${err.message}`);
      }
    };
  }
  throw new Error('fn必须是function');
};

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

export const replaceImport = (
  value: string,
  path: string,
): string => value.replace(/~?@\//, `${path}/`);

export const getOnly = (
  value: NodePath<t.Node> | NodePath<t.Node>[],
): NodePath<t.Node> => {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
};

export const toLineLetter = (
  letter: string,
): string => letter.replace(/(.)([A-Z])/g, '$1-$2').toLowerCase();

export const genVueResult = (): VueResult => ({
  import: new Map(),
  component: new Map(),
  data: new Map(),
  prop: new Map(),
  src: '',
  template: new Map(),
});

const typeEval: Record<string, string> = {
  Array: '(val => eval(val))',
  Object: '(val => eval("(" + val + ")"))',
  String: '(val => val)',
  Boolean: '(val => eval(val))',
  Number: '(val => Number(val))',
  Function: '(val => eval("(" + val + ")"))',
};

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
    const { type, default: value } = prop.get(key);
    return `
      ${key}: ${isNullStr(value)
  ? '""'
  : type === 'String'
    ? value
    : !['Boolean', 'Number'].includes(type)
      ? JSON.stringify(JSON.stringify(value))
      : JSON.stringify(value)}`;
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

export const getVuepressCompName = (
  path: string,
  name: string,
) => name
  .replace(`${path}/`, '')
  .replace(/\//g, '-')
  .replace(/\.vue$/, '');
