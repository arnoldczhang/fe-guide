import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import {
  VueResult,
  ExportExtractOption,
  PathInfo,
} from '../types';
import {
  errorCatch,
  toLineLetter,
  getOnly,
  getOnlyNodePath,
  getOnlyStr,
  toCamelLetter,
  hasLineLetter,
} from './helper';
import {
  getRealPath,
} from './tree';

/**
 * 记录驼峰和-两种组件形式
 * @param map
 * @param key
 * @param value
 */
const addComponentKeyValue = (
  map: Map<string, string>,
  key: string,
  value: string,
) => {
  map.set(key, value);
  if (hasLineLetter(key)) {
    map.set(toCamelLetter(key), value);
  } else {
    map.set(toLineLetter(key), value);
  }
};

/**
 * 判断是否是通过Vue.extend初始化
 */
const isVueExtend = errorCatch((
  p: NodePath<t.ExportDefaultDeclaration>,
) => {
  const declarationType = getOnlyStr(p.get('declaration.type'));
  if (declarationType !== 'CallExpression') return false;
  const calleeType = getOnlyStr(p.get('declaration.callee.type'));
  if (calleeType !== 'MemberExpression') return false;
  const object = getOnlyStr(p.get('declaration.callee.object.name'));
  const property = getOnlyStr(p.get('declaration.callee.property.name'));
  return object === 'Vue' && property === 'extend';
});

/**
 * extractVueObjectProps
 * @param p
 * @param result
 * @param option
 */
const extractVueObjectProps = errorCatch((
  p: NodePath<t.ExportDefaultDeclaration>,
  result: VueResult,
  option: ExportExtractOption,
) => {
  const { content = '', properties } = option;
  const propsObject = (properties || p.get('declaration.properties') as NodePath<t.Node>[])
    .filter(({ node }) => node.type === 'ObjectProperty')
    .find((prop) => getOnlyStr(prop.get('key.name')) === 'props');
  if (!propsObject) return result;
  const props = propsObject.get('value.properties');
  if (!Array.isArray(props)) return result;
  // props: { aa: { type: Boolean, default: xx } }
  props.forEach((prop) => {
    const key = getOnlyStr(prop.get('key.name'));
    const propProps = prop.get('value.properties');
    if (!Array.isArray(propProps)) return;
    // aa: { type: Boolean, default: xx }
    const typeProp = propProps.find(pp => getOnlyStr(pp.get('key.name')) === 'type');
    if (!typeProp) return;
    const type = getOnlyStr(typeProp.get('value.name'));
    let defaultValue: string | null = null;
    propProps.forEach((pp) => {
      const ppKey = getOnlyStr(pp.get('key.name'));
      if (ppKey !== 'default') return;
      let normal = true;
      // default: xx
      let defaultStruct = getOnly(pp.get('value'));
      if (!defaultStruct) {
        // default() { /** */ }
        defaultStruct = getOnly(pp.get('body'));
        normal = false;
      }
      const { start, end } = defaultStruct;
      defaultValue = `${!normal ? '() =>' : ''}${content.substring(start || 0, end || 0)}`;
      // type不是function的才需要执行
      if (type && type !== 'Function') {
        try {
          if (typeof defaultValue === 'string') {
            defaultValue = eval(defaultValue)();
          }
        } catch(e) {}
      }
      return defaultValue;
    });
    result.prop.set(key, {
      type,
      default: defaultValue,
    });
  });
});

/**
 * extractVueObjectComponentName
 * @param p
 * @param result
 * @param option
 */
const extractVueObjectComponentName = errorCatch((
  p: NodePath<t.ExportDefaultDeclaration>,
  result: VueResult,
  option?: ExportExtractOption,
) => {
  const { properties } = option || {};
  // name: xxx
  const nameObject = (properties || p.get('declaration.properties') as NodePath<t.Node>[])
    .filter(({ node }) => node.type === 'ObjectProperty')
    .find((prop) => getOnlyStr(prop.get('key.name')) === 'name');
  if (!nameObject) return result;
  const nameValue = getOnly(nameObject.get('value.value'));
  if (!nameValue) return result;
  result.data.set('name', nameValue);
});

/**
 * extractVueObjectData
 * @param p
 * @param result
 * @param option
 */
const extractVueObjectData = errorCatch((
  p: NodePath<t.ExportDefaultDeclaration>,
  result: VueResult,
  option: ExportExtractOption,
) => {
  const { content = '', properties } = option;
  const dataMethod = (properties || p.get('declaration.properties') as NodePath<t.Node>[])
    .filter(({ node }) => node.type === 'ObjectMethod')
    .find((methodP) => getOnlyStr(methodP.get('key.name')) === 'data');
  if (!dataMethod) return result;
  // return { /**  */ };
  const returnObject = (dataMethod.get('body.body') as NodePath<t.Node>[])
    .find((bodyP) => bodyP.type === 'ReturnStatement');
  if (!returnObject) return result;
  const argProperties = returnObject.get('argument.properties');
  if (Array.isArray(argProperties)) {
    // { key: value, key2: value2 };
    argProperties.forEach((prop) => {
      const key = getOnlyStr(prop.get('key.name'));
      const { start, end } = getOnly(prop.get('value'));
      result.data.set(key, content.substring(start || 0, end || 0));
    });
  }
});

/**
 * extractVueObjectComponents
 * @param p
 * @param result
 * @param option
 */
const extractVueObjectComponents = errorCatch((
  p: NodePath<t.ExportDefaultDeclaration>,
  result: VueResult,
  option?: ExportExtractOption,
) => {
  const { properties } = option || {};
  const componentObject = (properties || p.get('declaration.properties') as NodePath<t.Node>[])
    .filter(({ node }) => node.type === 'ObjectProperty')
    .find((methodP) => getOnlyStr(methodP.get('key.name')) === 'components');
  // { Comp1, Comp2 }
  if (!componentObject) return result;
  const compProperties = componentObject.get('value.properties');
  if (!Array.isArray(compProperties)) return result;
  compProperties.forEach((pro) => {
    const key = getOnly(pro.get('key.name'));
    const value = getOnly(pro.get('value.name'));
    addComponentKeyValue(
      result.component,
      String(key),
      String(value),
    );
  });
});

/**
 * extractComponentsProperty
 * @param p
 * @param result
 * @param content
 */
const extractComponentsProperty = errorCatch((
  p: NodePath<t.ExportDefaultDeclaration>,
  result: VueResult,
  content: string,
) => {
  // 处理class-properties，即data的绑定
  const klassChildren = p.get('declaration.body.body');
  if (!Array.isArray(klassChildren)) return result;
  klassChildren.forEach((klass) => {
    if (klass.type !== 'ClassProperty'
      || 'accessibility' in klass.node
      && klass.node.accessibility === 'public'
    ) return;
    const decorators = klass.get('decorators');
    // 不带装饰器的ClassProperty，这些都是data
    if (!Array.isArray(decorators) || !decorators.length) {
      const name = getOnly(klass.get('key.name'));
      const dataValue = getOnly(klass.get('value'));
      // 只声明了参数类型，未做初始化，则跳过取值
      if (!dataValue) return;
      const { start, end } = dataValue;
      result.data.set(name, content.substring(start || 0, end || 0));
    // 找装饰器是@Prop的
    } else {
      const [decorator] = decorators;
      const decoratorName = getOnly(decorator.get('expression.callee.name'));
      if (String(decoratorName) !== 'Prop') return;
      let tsType = '';
      try {
        tsType = getOnlyStr(
          klass.get('typeAnnotation.typeAnnotation.typeName.name')
        );
      } catch (e) {
        tsType = getOnlyStr(
          klass.get('typeAnnotation.typeAnnotation.type')
        );
      }

      // aaa: string
      const key = klass.get('key.name');
      if (!key) return;

      // @Prop() aaa: string;
      const argument = getOnlyNodePath(decorator.get('expression.arguments.0'));
      if (!argument) {
        return result.prop.set(getOnlyStr(key), {
          type: tsType,
          default: null,
        });
      }

      // @Prop({ default: /** */ }) aaa: string;
      const properties = argument.get('properties');
      // { default: /** */ }
      const defaultValue = properties.find(
        pro => getOnlyStr(pro.get('key.name')) === 'default'
      );
      if (!defaultValue) return;
      const { type } = defaultValue;
      let defaultContent: any = null;
      // default() { /** */ }
      if (type === 'ObjectMethod') {
        const { start, end } = getOnly(defaultValue.get('body'));
        defaultContent = `() => ${content.substring(start || 0, end || 0)}`;
        if (tsType != 'Function') {
          try {
            defaultContent = eval(defaultContent)();
          } catch(err) {
            try {
              defaultContent = eval('(' + defaultContent + ')');
            } catch(err) {
              defaultContent = null;
            }
          }
        }
      // default: () => { /** */ }
      } else {
        const { start, end } = getOnly(defaultValue.get('value'));
        defaultContent = content.substring(start || 0, end || 0);
        try {
          if (tsType != 'Function') {
            defaultContent = eval(defaultContent);
            if (typeof defaultContent === 'function') {
              defaultContent = defaultContent();
            }
          } else {
            defaultContent = eval(defaultContent);
          }
        } catch(e) {
          defaultContent = '';
        }
      }
      result.prop.set(getOnlyStr(key), {
        type: tsType,
        default: defaultContent,
      });
    }
  });
});

/**
 * extractComponentsDecoration
 * @param p
 * @param result
 * @param content
 */
const extractComponentsDecoration = errorCatch((
  p: NodePath<t.ExportDefaultDeclaration>,
  result: VueResult,
) => {
  try {
    const decorator = getOnlyNodePath(p.get('declaration.decorators.0'));
    const decoratorName = getOnly(decorator.get('expression.callee.name'));
    // @Component() or @Component
    if (String(decoratorName) === 'Component') {
      const argument = getOnlyNodePath(decorator.get('expression.arguments.0'));
      const properties = argument.get('properties');
      // components: { /** */ }
      const components = properties.find(
        pro => getOnlyStr(pro.get('key.name')) === 'components'
      );
      // { Comp1, Comp2: Comp1, Comp3 }
      if (!components) return result;
      const compProperties = components.get('value.properties');
      // Comp2: Comp1
      if (!Array.isArray(compProperties)) return result;
      compProperties.forEach((pro) => {
        const key = getOnly(pro.get('key.name'));
        let value = getOnly(pro.get('value.name'));
        // 有可能组件外面加了wrapper，比如Comp2: Wrapper(Comp1)
        if (!value) {
          const type = getOnly(pro.get('value.type'));
          if (String(type) === 'CallExpression') {
            const args = pro.get('value.arguments');
            // 这里简单处理，只取Wrapper里第一参数
            if (Array.isArray(args)) {
              value = args.map(p => getOnly(p.get('name')))[0];
            }
          }
        }
        addComponentKeyValue(
          result.component,
          String(key),
          String(value || key),
        );
      });
    }
  } catch (err) {
    Promise.resolve('@Component未做组件绑定');
  }
});

/**
 * extractDynamicImport
 */
const extractDynamicImport = errorCatch((
  p: NodePath<t.ImportDeclaration>,
  result: VueResult,
  pathInfo: PathInfo,
) => {
  const {
    current: path = '',
    node: npmPath,
    vuepress: rootPath,
  } = pathInfo;
  if (getOnlyNodePath(p.get('callee')).type !== 'Import') return;
  const args = p.get('arguments');
  if (!Array.isArray(args)) return;
  const [arg] = args;
  const value = getOnlyStr(arg.get('value'));
  result.import.set(value, getRealPath(rootPath, npmPath, path, value));
});

/**
 * extractVueGlobalComponent
 */
const extractVueGlobalComponent = errorCatch((
  p: NodePath<t.ImportDeclaration>,
  result: VueResult,
  pathInfo: PathInfo,
) => {
  const calleeType = getOnlyStr(p.get('callee.type'));
  if (calleeType !== 'MemberExpression') return result;
  const object = getOnlyStr(p.get('callee.object.name'));
  const property = getOnlyStr(p.get('callee.property.name'));
  if (object !== 'Vue' || property !== 'component') return result;
  const { global } = pathInfo;
  const { import: importDep } = result;
  const globalName = getOnlyStr(p.get('arguments.0.value'));
  const globalComponent = getOnlyStr(p.get('arguments.1.name'));
  addComponentKeyValue(
    global,
    globalName,
    importDep.get(globalComponent),
  );
});

/**
 * ImportDeclaration
 * @param p
 * @param result
 * @param pathInfo
 */
export function ImportDeclaration(
  p: NodePath<t.ImportDeclaration>,
  result: VueResult,
  pathInfo: PathInfo,
): VueResult {
  const {
    current: path = '',
    node: npmPath,
    vuepress: rootPath,
  } = pathInfo;
  const [specifier] = p.get('specifiers');
  const isValidSpecifier = specifier
    && specifier.type === 'ImportDefaultSpecifier';
  // import xx from 'xx';
  if (!isValidSpecifier) return result;
  const value = getOnly(p.get('source.value'));
  const name = getOnly(specifier.get('local.name'));
  // 'xx'
  if (typeof value !== 'string') return result;
  const absPath = getRealPath(rootPath, npmPath, path, value);
  result.import.set(name, absPath);
  return result;
}

/**
 * ExportDefaultDeclaration
 * @param p
 * @param result
 * @param content
 */
export function ExportDefaultDeclaration(
  p: NodePath<t.ExportDefaultDeclaration>,
  result: VueResult,
  content: string,
): VueResult {
  const { declaration } = p.node;
  const { type } = declaration;
  // vue用法之一：export default class xx extends Vue {}
  if (type === 'ClassDeclaration') {
    // @components({})
    extractComponentsDecoration(p, result, content);
    // @Prop({ default: /** */ }) aaa: string;
    // aaa: string = '';
    extractComponentsProperty(p, result, content);
  // vue用法之二：export default {}
  } else if (type === 'ObjectExpression') {
    // components: { comp1, comp2 },
    extractVueObjectComponents(p, result);
    // name: 'abc'
    extractVueObjectComponentName(p, result);
    // data() { return { /**  */ }; }
    extractVueObjectData(p, result, { content });
    // props: { aa: { type: Boolean, default: xx } }
    extractVueObjectProps(p, result, { content });
  // vue用法之三：Vue.extend({})
  } else if (isVueExtend(p)) {
    // 这里需要换成从Vue.extend中取属性
    const properties = p.get('declaration.arguments.0.properties');
    // components: { comp1, comp2 },
    extractVueObjectComponents(p, result, { properties });
    // name: 'abc'
    extractVueObjectComponentName(p, result, { properties });
    // data() { return { /**  */ }; }
    extractVueObjectData(p, result, { content, properties });
    // props: { aa: { type: Boolean, default: xx } }
    extractVueObjectProps(p, result, { content, properties });
  }
  return result;
}

/**
 * CallExpression
 *
 * - 处理@import(...)
 * - 处理Vue.component('GlobalComponent', GlobalComponent);
 *
 * @param p
 */
export function CallExpression(
  p: NodePath<t.ImportDeclaration>,
  result: VueResult,
  pathInfo: PathInfo,
) {
  // @import(...)
  extractDynamicImport(p, result, pathInfo);
  // Vue.component('GlobalComponent', GlobalComponent)
  extractVueGlobalComponent(p, result, pathInfo);
  return result;
}
