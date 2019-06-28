import { resolve } from 'path';

import {
  COMP_WXSS,
  IMPORT_TAG,
  INCLUDE_TAG,
  PATH,
  TPL_TAG,
} from '../config';
import { IAst, IPath } from '../types';
import { is } from './assert';
import {
  hasCach,
  setCach,
} from './cach';
import { getRelativePath } from './dir';
import {
  copy,
  ensure,
  exists,
  read,
  write,
} from './fs';
import {
  html2json,
  modifySuffix,
  parseFile,
} from './index';

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
      if (exists(srcWxss)) {
        ensure(destWxss);
        write(destWxss, `@import '${getRelativePath(srcWxss, destWxss)}';
        ${COMP_WXSS}
        `);
      }
      setCach(destWxml, true, PATH);
      // debugger;
      // console.log(srcWxml);
      // parseFile(srcWxml, destWxml, options);
    }
  } else if (is(tag, INCLUDE_TAG)) {
    return emptyNode;
  }
  return ast;
};
