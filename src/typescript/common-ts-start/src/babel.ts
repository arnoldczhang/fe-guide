import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import {
  VueResult,
  PathInfo,
} from './types';
import * as nodePath from 'path';
import {
  isRelativePath,
  replaceImport,
  toLineLetter,
  getOnly,
} from './helper';
import {
  getRealPath,
} from './tree';

const { join } = nodePath;

const addComponentKeyValue = (
  map: Map<string, string>,
  key: string,
  value: string,
) => {
  map.set(key, value);
  map.set(toLineLetter(key), value);
};

/**
 * extractVueObjectProps
 * @param p
 * @param result
 * @param content
 */
const extractVueObjectProps = (
  p: NodePath<t.ExportDefaultDeclaration>,
  result: VueResult,
  content: string,
) => {
  const propsObject = (p.get('declaration.properties') as NodePath<t.Node>[])
    .filter(({ node }) => node.type === 'ObjectProperty')
    .find((prop) => String(getOnly(prop.get('key.name')).node) === 'props');
  if (!propsObject) return result;
  const props = propsObject.get('value.properties');
  if (!Array.isArray(props)) return result;
  // props: { aa: { type: Boolean, default: xx } }
  props.forEach((prop) => {
    const key = String(getOnly(prop.get('key.name')).node);
    const propProps = prop.get('value.properties');
    if (!Array.isArray(propProps)) return;
    // aa: { type: Boolean, default: xx }
    let type = 'Object';
    let defaultValue = 'null';
    propProps.forEach((pp) => {
      const ppKey = String(getOnly(pp.get('key.name')).node);
      if (ppKey === 'type') {
        return type = String(getOnly(pp.get('value.name')).node);
      }

      if (ppKey === 'default') {
        let normal = true;
        // default: xx
        let defaultStruct = getOnly(pp.get('value')).node;
        if (!defaultStruct) {
          // default() { /** */ }
          defaultStruct = getOnly(pp.get('body')).node;
          normal = false;
        }
        const { start, end } = defaultStruct;
        return defaultValue = `${!normal ? '()' : ''}${content.substring(start || 0, end || 0)}`;
      }
    });
    result.prop.set(key, {
      type,
      default: defaultValue,
    });
  });
};

/**
 * extractVueObjectComponentName
 * @param p
 * @param result
 * @param content
 */
const extractVueObjectComponentName = (
  p: NodePath<t.ExportDefaultDeclaration>,
  result: VueResult,
  content: string,
) => {
  // name: xxx
  const nameObject = (p.get('declaration.properties') as NodePath<t.Node>[])
    .filter(({ node }) => node.type === 'ObjectProperty')
    .find((prop) => String(getOnly(prop.get('key.name')).node) === 'name');
  if (!nameObject) return result;
  const nameValue = getOnly(nameObject.get('value.value')).node;
  if (!nameValue) return result;
  result.data.set('name', nameValue);
};

/**
 * extractVueObjectData
 * @param p
 * @param result
 * @param content
 */
const extractVueObjectData = (
  p: NodePath<t.ExportDefaultDeclaration>,
  result: VueResult,
  content: string,
) => {
  const dataMethod = (p.get('declaration.properties') as NodePath<t.Node>[])
    .filter(({ node }) => node.type === 'ObjectMethod')
    .find((methodP) => String(getOnly(methodP.get('key.name')).node) === 'data');
  if (!dataMethod) return result;
  // return { /**  */ };
  const returnObject = (dataMethod.get('body.body') as NodePath<t.Node>[])
    .find((bodyP) => bodyP.type === 'ReturnStatement');
  if (!returnObject) return result;
  const properties = returnObject.get('argument.properties');
  if (Array.isArray(properties)) {
    // { key: value, key2: value2 };
    properties.forEach((prop) => {
      const key = String(getOnly(prop.get('key.name')).node);
      const { node: { start, end } } = getOnly(prop.get('value'));
      result.data.set(key, content.substring(start || 0, end || 0));
    });
  }
};

/**
 * extractVueObjectComponents
 * @param p
 * @param result
 * @param content
 */
const extractVueObjectComponents = (
  p: NodePath<t.ExportDefaultDeclaration>,
  result: VueResult,
  content: string,
) => {
  const componentObject = (p.get('declaration.properties') as NodePath<t.Node>[])
    .filter(({ node }) => node.type === 'ObjectProperty')
    .find((methodP) => String(getOnly(methodP.get('key.name')).node) === 'components');
  // { Comp1, Comp2 }
  if (!componentObject) return result;
  const compProperties = componentObject.get('value.properties');
  if (!Array.isArray(compProperties)) return result;
  compProperties.forEach((pro) => {
    const { node: key } = getOnly(pro.get('key.name'));
    const { node: value } = getOnly(pro.get('value.name'));
    addComponentKeyValue(
      result.component,
      String(key),
      String(value),
    );
  });
};

/**
 * extractComponentsProperty
 * @param p
 * @param result
 * @param content
 */
const extractComponentsProperty = (
  p: NodePath<t.ExportDefaultDeclaration>,
  result: VueResult,
  content: string,
) => {
  // 处理class-properties，即data的绑定
  const klassChildren = p.get('declaration.body.body');
  if (!Array.isArray(klassChildren)) return result;
  klassChildren.forEach((klass) => {
    if (klass.type !== 'ClassProperty'
      || 'accessibility' in klass.node && klass.node.accessibility === 'public'
    ) return;
    const decorators = klass.get('decorators');
    // 不带装饰器的ClassProperty - data
    if (!Array.isArray(decorators) || !decorators.length) {
      const { node: name } = getOnly(klass.get('key.name'));
      const { node: { start, end } } = getOnly(klass.get('value'));
      result.data.set(name, content.substring(start || 0, end || 0));
    } else {
      const [decorator] = decorators;
      const decoratorName = getOnly(decorator.get('expression.callee.name'));
      if (String(decoratorName.node) !== 'Prop') return;
      // @Prop({ default: /** */ }) aaa: string;
      const argument = getOnly(decorator.get('expression.arguments.0'));
      const properties = argument.get('properties');
      // { default: /** */ }
      const defaultValue = properties.find(
        pro => String(getOnly(pro.get('key.name')).node) === 'default'
      );
      if (!defaultValue) return;
      const { start, end } = getOnly(defaultValue.get('value')).node;
      const key = klass.get('key.name');
      if (!key) return;
      result.prop.set(String(getOnly(key).node), {
        default: content.substring(start || 0, end || 0),
      });
    }
  });
};

/**
 * extractComponentsDecoration
 * @param p
 * @param result
 * @param content
 */
const extractComponentsDecoration = (
  p: NodePath<t.ExportDefaultDeclaration>,
  result: VueResult,
  content: string,
) => {
  try {
    const decorator = getOnly(p.get('declaration.decorators.0'));
    const decoratorName = getOnly(decorator.get('expression.callee.name'));
    // @Component() or @Component
    if (String(decoratorName.node) === 'Component') {
      const argument = getOnly(decorator.get('expression.arguments.0'));
      const properties = argument.get('properties');
      // components: { /** */ }
      const components = properties.find(
        pro => String(getOnly(pro.get('key.name')).node) === 'components'
      );
      // { Comp1, Comp2: Comp1, Comp3 }
      if (!components) return result;
      const compProperties = components.get('value.properties');
      //
      if (!Array.isArray(compProperties)) return result;
      compProperties.forEach((pro) => {
        const { node: key } = getOnly(pro.get('key.name'));
        const { node: value } = getOnly(pro.get('value.name'));
        addComponentKeyValue(
          result.component,
          String(key),
          String(value),
        );
      });
    }
  } catch (err) {
    Promise.resolve('@Component未做组件绑定');
  }
};

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
    npm: npmPath,
    root: rootPath,
  } = pathInfo;
  const [specifier] = p.get('specifiers');
  const isValidSpecifier = specifier
    && specifier.type === 'ImportDefaultSpecifier';
  // import xx from 'xx';
  if (!isValidSpecifier) return result;
  const sourceValue = getOnly(p.get('source.value'));
  const { node: name } = getOnly(specifier.get('local.name'));
  const { node: value } = sourceValue;
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
  // export default class xx extends Vue {}
  if (type === 'ClassDeclaration') {
    // @components({})
    extractComponentsDecoration(p, result, content);
    // @Prop({ default: /** */ }) aaa: string;
    // aaa: string = '';
    extractComponentsProperty(p, result, content);
  // export default {}
  } else if (type === 'ObjectExpression') {
    // components: { comp1, comp2 },
    extractVueObjectComponents(p, result, content);
    // name: 'abc'
    extractVueObjectComponentName(p, result, content);
    // data() { return { /**  */ }; }
    extractVueObjectData(p, result, content);
    // props: { aa: { type: Boolean, default: xx } }
    extractVueObjectProps(p, result, content);
  }
  return result;
}

/**
 * CallExpression
 * @param p
 */
export function CallExpression(
  p: NodePath<t.ImportDeclaration>,
  result: VueResult,
  pathInfo: PathInfo,
) {
  const {
    current: path = '',
    npm: npmPath,
    root: rootPath,
  } = pathInfo;
  if (getOnly(p.get('callee')).type === 'Import') {
    const args = p.get('arguments');
    if (!Array.isArray(args)) return;
    const [arg] = args;
    const value = getOnly(arg.get('value')).node;
    result.import.set(value, getRealPath(
      rootPath,
      npmPath,
      path,
      String(value),
    ));
  }
}
