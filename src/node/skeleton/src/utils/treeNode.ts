import { transformSync } from '@babel/core';
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
import { is } from './assert';
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
  write,
} from './fs';
import {
  addSuffix,
  ensureAndInsertWxss,
  getJsonValue,
  html2json,
  insertInitialWxss,
  isNpmComponent,
  modifySuffix,
  parseFile,
  updateUsingInJsonConfig,
} from './index';
import Logger from './log';
import {
  isBindEvent,
  isElse,
  removeBlank,
} from './reg';

const {
  keys,
} = Object;
const logger = Logger.getInstance();
const emptyNode = {};

/**
 * parseAsTreeNode
 * @param ast
 * @param options
 */
export const parseAsTreeNode = (
  ast: IAst,
  options: IPath,
): IAst => {
  return [
    parseFromSignAttr,
    parseFromTag,
    parseFromNode,
    parseFromAttr,
  ].reduce((res: IAst, next) => next(res, options), ast);
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
  if (node !== TEXT) { return ast; }
  ast.text = removeBlank(text);
  if (!ast.text) {
    return emptyNode;
  }
  return ast;
};

/**
 * parseFromSignAttr
 * @param ast
 * @param options
 */
export const parseFromSignAttr = (
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
      case ATTR_FOR:
      case ATTR_REPEAT:
        result[WX_FOR] = `{{[${Array(+value).fill(1)}]}}`;
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
        if (!(key in result)) {
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
  if (!attr) { return ast; }
  const result: ICO = {};
  const attrKeys = keys(attr);
  for (let key, i = 0; i < attrKeys.length; i += 1) {
    key = attrKeys[i];
    switch (true) {
      // remove all events
      case isBindEvent(key):
        break;
      // remove all `wx:else` and `wx:elif`
      case isElse(key):
        return emptyNode;
      default:
        if (!(key in result)) {
          result[key] = attr[key];
        }
        break;
    }
  }
  ast.attr = result;
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
  const { protoPath, mainPath } = options;

  if (!tag) { return ast; }
  switch (tag) {
    // <import />
    case IMPORT_TAG:
      if (attr && attr.src) {
        const srcWxml: string = resolve(protoPath, attr.src);
        const destWxml: string = resolve(mainPath, attr.src);
        if (!hasCach(destWxml)) {
          const srcWxss: string = modifySuffix(srcWxml, 'wxss');
          const destWxss: string = modifySuffix(destWxml, 'wxss');
          ensure(destWxml);
          copy(srcWxml, destWxml);
          setCach(destWxml, true, PATH);
          write(
            destWxml,
            parseFile(srcWxml, destWxml, options),
          );
          ensureAndInsertWxss(srcWxss, destWxss);
        }
      }
      break;

    // TODO <include /> do nothing now
    case INCLUDE_TAG:
      return emptyNode;

    // <image />
    case IMAGE_TAG:
      if (attr && attr.src && /^\./.test(attr.src)) {
        const { src } = attr;
        const [dir, fileName] = [getDir(src), getFileName(src)];
        attr.src = join(getRelativePath(protoPath, join(mainPath, dir)), fileName);
      }
      break;
    // remove <wxs />
    case WXS_TAG:
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
 */
export const parseFromJSON = (
  srcFile: string,
  destFile: string,
  json: ICO,
  options: IPath,
): ICO => {
  const src: string = getDir(srcFile);
  const dest: string = getDir(destFile);
  const { root, compPath } = options;
  keys(json).forEach((key: string): void => {
    let pathValue: string = json[key];
    let [srcJs, destJs, srcWxml, destWxml, srcWxss, destWxss, srcJson, destJson] = Array(10);
    if (isNpmComponent(pathValue)) {
      pathValue = pathValue.slice(1);
      srcJs = pathResolve.sync(pathValue, { basedir: root });
      const srcJsFileName: string = getFileName(srcJs);
      const [srcJsName] = srcJsFileName.split('.');
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
      const srcPath: string = resolve(src, pathValue);
      const destPath: string = resolve(dest, pathValue);
      srcJson = addSuffix(srcPath, 'json');
      destJson = addSuffix(destPath, 'json');
      srcJs = addSuffix(srcPath, 'js');
      destJs = addSuffix(destPath, 'js');
      srcWxml = addSuffix(srcPath, 'wxml');
      destWxml = addSuffix(destPath, 'wxml');
      srcWxss = addSuffix(srcPath, 'wxss');
      destWxss = addSuffix(destPath, 'wxss');
    }

    if (!hasCach(destWxml)) {
      // gen component-wxml
      ensure(destWxml);
      copy(srcWxml, destWxml);
      setCach(destWxml, true, PATH);
      write(
        destWxml,
        parseFile(srcWxml, destWxml, options),
      );
      logger.note(destWxml);

      // gen component-json
      updateUsingInJsonConfig(srcJson, destJson, options);

      // gen component-wxss
      ensureAndInsertWxss(srcWxss, destWxss);

      // gen component-js
      ensure(destJs);
      write(destJs, COMP_JS);

      // FIXME copy Components.properties to destJs with babel
      // const { ast } = transformSync(String(read(srcJs)), {
      //   ast: true,
      // });
      logger.note(destJs);
    }
  });
  return json;
};
