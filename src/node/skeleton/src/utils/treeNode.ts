import { resolve } from 'path';

import * as pathResolve from 'resolve';
import {
  COMP_JS,
  COMP_WXSS,
  IMPORT_TAG,
  INCLUDE_TAG,
  JSON_CONFIG,
  PATH,
  TPL_TAG,
  WXS_TAG,
} from '../config';
import { IAst, ICO, IPath } from '../types';
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
  getJsonValue,
  html2json,
  insertInitialWxss,
  isNpmComponent,
  modifySuffix,
  parseFile,
  updateUsingInJsonConfig,
} from './index';
import Logger from './log';

const {
  parse,
  stringify,
} = JSON;
const logger = Logger.getInstance();
const emptyNode = {};

export const parseAsTreeNode = (ast: IAst, options: IPath): IAst => {
  const { node, tag, text, attr } = ast;
  return parseFromTag(ast, options);
};

export const parseFromTag = (
  ast: IAst,
  options: IPath,
): IAst => {
  const { tag, attr } = ast;
  const { protoPath, mainPath } = options;
  if (is(tag, IMPORT_TAG) && attr.src) {
    const srcWxml = resolve(protoPath, attr.src);
    const destWxml = resolve(mainPath, attr.src);
    const srcWxss = modifySuffix(srcWxml, 'wxss');
    const destWxss = modifySuffix(destWxml, 'wxss');
    if (!hasCach(destWxml)) {
      ensure(destWxml);
      copy(srcWxml, destWxml);
      setCach(destWxml, true, PATH);
      parseFile(srcWxml, destWxml, options);

      if (exists(srcWxss)) {
        ensure(destWxss);
        write(destWxss, insertInitialWxss(`@import '${getRelativePath(srcWxss, destWxss)}';`));
      }
    }
  } else if (is(tag, INCLUDE_TAG)) {
    return emptyNode;
  } else if (is(tag, WXS_TAG)) {
    return emptyNode;
  }
  return ast;
};

export const parseFromJSON = (
  srcFile: string,
  destFile: string,
  json: ICO,
  options: IPath,
): ICO => {
  const src = getDir(srcFile);
  const dest = getDir(destFile);
  const { root, compPath } = options;
  Object.keys(json).forEach((key: string) => {
    let pathValue = json[key];
    let [srcJs, destJs, srcWxml, destWxml, srcWxss, destWxss, srcJson, destJson] = Array(10);
    if (isNpmComponent(pathValue)) {
      pathValue = pathValue.slice(1);
      srcJs = pathResolve.sync(pathValue, { basedir: root });
      const srcJsFileName = getFileName(srcJs);
      const [srcJsName] = srcJsFileName.split('.');
      const destRoot = resolve(compPath, pathValue);
      srcJson = modifySuffix(srcJs, 'json');
      destJson = `${destRoot}/${modifySuffix(srcJsFileName, 'json')}`;
      destJs = `${destRoot}/${modifySuffix(srcJsFileName, 'js')}`;
      srcWxml = modifySuffix(srcJs, 'wxml');
      destWxml = `${destRoot}/${modifySuffix(srcJsFileName, 'wxml')}`;
      srcWxss = modifySuffix(srcJs, 'wxss');
      destWxss = `${destRoot}/${modifySuffix(srcJsFileName, 'wxss')}`;
      json[key] = `${getRelativePath(destRoot, destFile)}/${srcJsName}`;
    } else {
      const srcPath = resolve(src, pathValue);
      const destPath = resolve(dest, pathValue);
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
      if (exists(srcWxss)) {
        ensure(destWxss);
        write(destWxss, insertInitialWxss(`@import '${getRelativePath(srcWxss, destWxss)}';`));
        logger.note(destWxss);
      }

      // gen component-js
      ensure(destJs);
      write(destJs, COMP_JS);
      logger.note(destJs);
    }
  });
  return json;
};
