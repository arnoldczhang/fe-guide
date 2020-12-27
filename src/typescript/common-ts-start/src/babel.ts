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
  getOnly,
} from './helper';
import{
  getFilePath,
} from './fs';
import {
  getRealPath,
} from './tree';

const { join } = nodePath;

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
        // { Comp1, Comp2 }
        if (!components) return result;
        const compProperties = components.get('value.properties');
        //
        if (!Array.isArray(compProperties)) return result;
        compProperties.forEach((pro) => {
          const { node: key } = getOnly(pro.get('key.name'));
          const { node: value } = getOnly(pro.get('value.name'));
          if (result.component.has(value)) {
            const list = result.component.get(value);
            result.component.set(value, list.add(key));
          } else {
            result.component.set(value, new Set([key]));
          }
        });
      }
    } catch (err) {
      Promise.resolve('@Component未做组件绑定');
    }
    // 处理class-properties，即data的绑定
    const klassChildren = p.get('declaration.body.body');
    if (!Array.isArray(klassChildren)) return result;
    klassChildren.forEach((klass) => {
      if (klass.type !== 'ClassProperty'
        || 'accessibility' in klass.node && klass.node.accessibility === 'public'
      ) return;
      const decorators = klass.get('decorators');
      // 不分析带装饰器ClassProperty
      if (!Array.isArray(decorators) || !decorators.length) {
        const { node: name } = getOnly(klass.get('key.name'));
        const { node: { start, end } } = getOnly(klass.get('value'));
        result.data.set(name, content.substring(start || 0, end || 0));
      }
    });
  // export default {}
  } else if (type === 'ObjectExpression') {
    // components: { comp1, comp2 },
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
      if (result.component.has(value)) {
        const list = result.component.get(value);
        result.component.set(value, list.add(key));
      } else {
        result.component.set(value, new Set([key]));
      }
    });
    // data() { return { /**  */ }; }
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
  }
  return result;
}

/**
 * CallExpression
 * @param p
 */
export function CallExpression(p: NodePath<t.CallExpression>) {
  if (p.get('callee').type === 'Import') {
    const [arg] = p.get('arguments');
  }
}
