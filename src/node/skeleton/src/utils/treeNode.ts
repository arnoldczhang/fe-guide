import { join, resolve } from 'path';

import * as pathResolve from 'resolve';
import {
  COMP_JS,
  COMP_WXSS,
  IMAGE_TAG,
  IMPORT_TAG,
  INCLUDE_TAG,
  JSON_CONFIG,
  PATH,
  TPL_TAG,
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
} from './reg';

const {
  keys,
} = Object;
const logger = Logger.getInstance();
const emptyNode = {};

export const parseAsTreeNode = (ast: IAst, options: IPath): IAst => {
  return [
    parseFromTag,
    parseFromAttr,
  ].reduce((res: IAst, next) => next(res, options), ast);
};

export const parseFromAttr = (
  ast: IAst,
  options: IPath,
): IAst => {
  const { attr } = ast;
  if (attr) {
    const result: ICO = {};
    keys(attr).forEach((key: string): void => {
      switch (true) {
        case isBindEvent(key):
          break;
        default:
          result[key] = attr[key];
          break;
      }
    });
    ast.attr = result;
  }
  return ast;
};

export const parseFromTag = (
  ast: IAst,
  options: IPath,
): IAst => {
  const { tag, attr } = ast;
  const { protoPath, mainPath } = options;

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
          parseFile(srcWxml, destWxml, options);
          ensureAndInsertWxss(srcWxss, destWxss);
        }
      }
      break;

    // TODO <include /> do nothing now
    case INCLUDE_TAG:
      return emptyNode;

    case IMAGE_TAG:
      if (attr && attr.src && /^\./.test(attr.src)) {
        attr.src = join(getRelativePath(protoPath, mainPath), attr.src);
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
      logger.note(destJs);
    }
  });
  return json;
};
