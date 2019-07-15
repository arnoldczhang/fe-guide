import { join, resolve } from 'path';
import * as pathResolve from 'resolve';
import {
  ATTR_BG,
  ATTR_FOR,
  ATTR_REMOVE,
  ATTR_REPEAT,
  ATTR_SHOW,
  COMP_JS,
  COMP_WXSS,
  IMAGE_TAG,
  IMPORT_TAG,
  INCLUDE_TAG,
  JSON_CONFIG,
  KLASS,
  PATH,
  ROOT_TAG,
  TEMPLATE_TAG,
  TEXT,
  TPL_TAG,
  WX_FOR,
  WX_FOR_INDEX,
  WX_HIDDEN,
  WX_IF,
  WX_KEY,
  WXS_TAG,
} from '../config';
import { CF, IAst, ICO, IPath } from '../types';
import { has, is } from './assert';
import {
  hasCach,
  setCach,
} from './cach';
import {
  getDir,
  getFileName,
  getRelativePath,
} from './dir';
import {
  copy,
  ensure,
  exists,
  read,
  state,
  write,
} from './fs';
import {
  addSuffix,
  ensureAndInsertWxml,
  ensureAndInsertWxss,
  modifySuffix,
  updateUsingInJsonConfig,
} from './index';
import Logger from './log';
import {
  genKlass,
} from './random';
import {
  hasWxVariable,
  interceptWxVariable,
  isBindEvent,
  isElif,
  isId,
  isKlass,
  isNpmComponent,
  removeBlank,
  splitWith,
} from './reg';
import { cachKlassStruct } from './treeshake';

const {
  keys,
} = Object;
const emptyNode = {};

/**
 * parseAsTreeNode
 * @param ast
 * @param options
 */
export const parseAsTreeNode = (
  ast: IAst,
  options: IPath,
): IAst => (
    [
      parseFromConfig,
      parseFromCustomAttr,
      parseFromTag,
      parseFromNode,
      parseFromAttr,
      parseFromStruct,
    ].reduce((res: IAst, next) => next(res, options), ast)
);

/**
 * parseFromConfig
 * @param ast
 * @param options
 */
const parseFromConfig = (
  ast: IAst,
  options: IPath,
): IAst => {
  const { ignoreTags } = options;
  if (ignoreTags && ignoreTags.includes(ast.tag)) {
    return emptyNode;
  }
  return ast;
};

/**
 * parseFromNode
 * @param ast
 * @param options
 */
export const parseFromNode = (
  ast: IAst,
  options: IPath,
): IAst => {
  const { node, text } = ast;
  if (node !== TEXT) {
    if (node === ROOT_TAG) {
      setRootShow(ast, options);
    }
    return ast;
  }
  ast.text = removeBlank(text);
  if (!ast.text) {
    return emptyNode;
  }
  return ast;
};

/**
 * parseFromCustomAttr
 * @param ast
 * @param options
 */
export const parseFromCustomAttr = (
  ast: IAst,
  options: IPath,
): IAst => {
  const { attr } = ast;
  if (!attr) { return ast; }
  const result: ICO = {};
  const attrKeys = keys(attr);
  for (let key, value, i = 0; i < attrKeys.length; i += 1) {
    key = attrKeys[i];
    value = attr[key];
    switch (key) {
      // repeat
      // support 2 ways:
      //  1. number / {{number}}
      //  2. variable which represents an array
      case ATTR_FOR:
      case ATTR_REPEAT:
        value = interceptWxVariable(value);
        result[WX_FOR] = isNaN(+value) ? `{{${value}}}` : `{{[${Array(+value).fill(1)}]}}`;
        result[WX_KEY] = `{{${attr[WX_FOR_INDEX] || 'index'}}}`;
        break;
      case ATTR_SHOW:
        result[WX_HIDDEN] = `{{false}}`;
        result[WX_IF] = '{{true}}';
        break;
      case ATTR_REMOVE:
        return emptyNode;
      case ATTR_BG:
        result[KLASS] = [...attr[KLASS], 'skull-grey'];
      default:
        if (!has(key, result)) {
          result[key] = value;
        }
        break;
    }
  }
  ast.attr = result;
  return ast;
};

/**
 * parseFromAttr
 * @param ast
 * @param options
 */
export const parseFromAttr = (
  ast: IAst,
  options: IPath,
): IAst => {
  const { attr } = ast;
  const { wxmlKlassInfo } = options;
  if (!attr) { return ast; }
  const result: ICO = {};
  const attrKeys = keys(attr);
  for (let key, value, i = 0; i < attrKeys.length; i += 1) {
    key = attrKeys[i];
    value = attr[key];
    switch (true) {
      // remove all events
      case isBindEvent(key):
        break;
      // remove all `wx:elif`
      case isElif(key):
        return emptyNode;
      // replace id(without wx variable) with a random class
      case isId(key):
        if (!hasWxVariable(value)) {
          const [klassName, klass] = genKlass();
          (result.class ? result : attr).class += ` ${klassName}`;
          wxmlKlassInfo[`#${value}`] = klass;
        }
        break;
      default:
        if (!has(key, result)) {
          result[key] = attr[key];
        }
        break;
    }
  }
  ast.attr = result;
  return ast;
};

/**
 * parseFromStruct
 * @param ast
 * @param options
 */
export const parseFromStruct = (
  ast: IAst,
  options: IPath,
): IAst => {
  const { tag, attr } = ast;
  switch (true) {
    // <template />
    // cach template file for wxss treeshake
    case is(tag, TEMPLATE_TAG):
      if (attr && attr.name) {
        cachKlassStruct(`${TEMPLATE_TAG}.${attr.name}`, ast, options);
      }
      break;
    // cach class tag for wxss treeshake
    case !!(attr && attr.class):
      cachKlassStruct(attr.class, ast, options);
      break;
    default:
      break;
  }
  return ast;
};

/**
 * parseFromTag
 * @param ast
 * @param options
 */
export const parseFromTag = (
  ast: IAst,
  options: IPath,
): IAst => {
  const { tag, attr } = ast;
  const { protoPath, mainPath, skeletonKeys } = options;
  if (!tag) { return ast; }

  switch (true) {
    // <import />
    case is(tag, IMPORT_TAG):
      if (attr && attr.src) {
        const srcWxml: string = resolve(protoPath, attr.src);
        const destWxml: string = resolve(mainPath, attr.src);
        if (!hasCach(destWxml, PATH)) {
          const srcWxss: string = modifySuffix(srcWxml, 'wxss');
          const destWxss: string = modifySuffix(destWxml, 'wxss');
          setCach(destWxml, 1, PATH);
          ensureAndInsertWxml(srcWxml, destWxml, options);
          ensureAndInsertWxss(srcWxss, destWxss, options);
        }
      }
      break;
    // <include />
    case is(tag, INCLUDE_TAG):
      if (attr && attr.src) {
        const srcWxml: string = resolve(protoPath, attr.src);
        const destWxml: string = resolve(mainPath, attr.src);
        if (!hasCach(destWxml, PATH)) {
          setCach(destWxml, 1, PATH);
          ensureAndInsertWxml(srcWxml, destWxml, options);
        }
      }
      break;
    // <image />
    case is(tag, IMAGE_TAG):
      if (attr && attr.src && /^\./.test(attr.src)) {
        const { src } = attr;
        const [dir, fileName] = [getDir(src), getFileName(src)];
        attr.src = join(getRelativePath(protoPath, join(mainPath, dir)), fileName);
      }
      break;
    // remove <wxs />
    case is(tag, WXS_TAG):
      return emptyNode;
    // ignore skeleton tag
    // fix: compiling skeleton to skeleton
    case skeletonKeys.has(tag):
      return emptyNode;
    default:
      break;
  }
  return ast;
};

/**
 * parseFromJSON
 * @param srcFile
 * @param destFile
 * @param json
 * @param options
 * @param isPage
 */
export const parseFromJSON = (
  srcFile: string,
  destFile: string,
  json: ICO,
  options: IPath,
  isPage?: boolean,
): ICO => {
  const { usingComponentKeys, skeletonKeys } = options;
  const src: string = getDir(srcFile);
  const dest: string = getDir(destFile);
  const { root, compPath, srcPath: rootSrcPath, outputPath } = options;
  keys(json).forEach((key: string): void => {
    if (isPage) {
      usingComponentKeys.add(key);
    }
    let pathValue: string = json[key];
    let [srcJs, destJs, srcWxml, destWxml, srcWxss, destWxss, srcJson, destJson] = Array(10);
    if (isNpmComponent(pathValue)) {
      pathValue = pathValue.slice(1);
      srcJs = pathResolve.sync(pathValue, { basedir: root });
      const srcJsFileName: string = getFileName(srcJs);
      const [srcJsName] = splitWith(srcJsFileName, '.');
      const destRoot: string = resolve(compPath, pathValue);
      srcJson = modifySuffix(srcJs, 'json');
      destJson = `${destRoot}/${modifySuffix(srcJsFileName, 'json')}`;
      destJs = `${destRoot}/${modifySuffix(srcJsFileName, 'js')}`;
      srcWxml = modifySuffix(srcJs, 'wxml');
      destWxml = `${destRoot}/${modifySuffix(srcJsFileName, 'wxml')}`;
      srcWxss = modifySuffix(srcJs, 'wxss');
      destWxss = `${destRoot}/${modifySuffix(srcJsFileName, 'wxss')}`;
      json[key] = `${getRelativePath(destRoot, destFile)}/${srcJsName}`;
    } else {
      const isRootStyle = /^\//.test(pathValue);
      if (isRootStyle) {
        pathValue = pathValue.slice(1);
      }
      let srcPath: string = resolve(isRootStyle ? rootSrcPath : src, pathValue);
      let destPath: string = resolve(isRootStyle ? outputPath : dest, pathValue);
      // fix: compiling skeleton to skeleton
      if (srcPath.includes(outputPath)) {
        delete json[key];
        skeletonKeys.add(key);
        usingComponentKeys.delete(key);
        return;
      }

      try {
        if (state(srcPath).isDirectory()) {
          srcPath = `${srcPath}/index`;
          destPath = `${destPath}/index`;
        }
      } catch (err) {

      }
      srcJson = addSuffix(srcPath, 'json');
      destJson = addSuffix(destPath, 'json');
      srcJs = addSuffix(srcPath, 'js');
      destJs = addSuffix(destPath, 'js');
      srcWxml = addSuffix(srcPath, 'wxml');
      destWxml = addSuffix(destPath, 'wxml');
      srcWxss = addSuffix(srcPath, 'wxss');
      destWxss = addSuffix(destPath, 'wxss');
    }

    if (!hasCach(destWxml, PATH)) {
      // gen component-wxml
      setCach(destWxml, 1, PATH);
      ensureAndInsertWxml(srcWxml, destWxml, options);

      // gen component-json
      updateUsingInJsonConfig(srcJson, destJson, options);

      // gen component-wxss
      ensureAndInsertWxss(srcWxss, destWxss, options);

      // gen component-js
      ensure(destJs);
      write(destJs, COMP_JS);

      // TODO copy Components.properties to destJs with babel
      // const { ast } = transformSync(String(read(srcJs)), {
      //   ast: true,
      // });
    }
  });
  return json;
};

export const setRootShow = (
  ast: IAst,
  options: IPath,
): void => {
  const { child } = ast;
  const { isPage } = options;
  if (isPage && child && child.length) {
    child.forEach((
      ch: IAst,
      idx: number,
      array: IAst[],
    ) => {
      const { attr, tag } = ch;
      if (!tag) { return; }
      if (!attr) {
        ch.attr = {};
      }
      ch.attr[ATTR_SHOW] = '';
    });
  }
};
