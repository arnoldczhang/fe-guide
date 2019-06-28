import { resolve } from 'path';

import {
  IMPORT_TAG,
  INCLUDE_TAG,
  TPL_TAG,
} from '../config';
import { IAst, IPath } from '../types';
import { is } from './assert';
import { read } from './fs';
import { html2json } from './index';

const emptyNode = {};

export const resolveAsTreeNode = (ast: IAst, options: IPath): IAst => {
  const { node, tag, text, attr } = ast;
  return resolveFromTag(ast, options);
};

export const resolveFromTag = (
  ast: IAst,
  options: IPath,
): IAst => {
  const { tag, attr } = ast;
  const { mainPath } = options;
  if (is(tag, IMPORT_TAG) && attr.src) {
    return html2json(read(resolve(mainPath, attr.src)));
  } else if (is(tag, INCLUDE_TAG)) {
    return emptyNode;
  }
  return ast;
};
