import { html2json, json2html } from 'html2json';
import { DomElement, DomHandler, Parser } from 'htmlparser2';
import {
  COMP_JS,
  COMP_JSON,
  COMP_WXSS,
} from '../config';
import { IAst, ICO, IPath } from '../types';
import {
  copy,
  ensure,
  read,
  write,
} from './fs';
import { parseAsTreeNode } from './treeNode';

import {
  getDir,
  getFileName,
  getPageWxml,
  getRelativePath,
  getSplitDir,
  identity,
  modifySuffix,
} from './dir';

export const html2ast = (rawHtml: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const parseHandler = new DomHandler((error: any, dom: DomElement[]): any => {
      if (error) {
        reject(error);
      } else {
        resolve(dom);
      }
    });
    const parser = new Parser(parseHandler);
    parser.parseComplete(rawHtml);
  });
};

export const treewalk = (
  ast: IAst,
  options: IPath,
): IAst => {
  if (ast) {
    const { child } = ast;
    ast = parseAsTreeNode(ast, options);
    if (child && child.length) {
      child.forEach((
        ch: IAst,
        idx: number,
        array: IAst[],
      ) => (
        array[idx] = treewalk(ch, options)
      ));
    }
  }
  return ast;
};

export const parseFile = (
  src: string,
  dest: string,
  options: IPath,
) => {
  const { root, srcPath } = options;
  const content = read(dest);
  const json = html2json(content);
  treewalk(json, {
    root,
    srcPath,
    protoPath: getDir(src),
    mainPath: getDir(dest),
    mainFilePath: dest,
  });
};

export const genNewComponent = (
  srcWxml: string,
  options: IPath,
) => {
  const { examplePath, srcPath } = options;
  const relativePath = srcWxml.replace(srcPath, '');
  const srcWxss = modifySuffix(srcWxml, 'wxss');

  // gen wxml
  const destWxml = `${examplePath}${relativePath}`;
  ensure(destWxml);
  copy(srcWxml, destWxml);

  // gen json
  const destJson = `${examplePath}${modifySuffix(relativePath, 'json')}`;
  ensure(destJson);
  write(destJson, COMP_JSON);

  // gen wxss
  const destWxss = `${examplePath}${modifySuffix(relativePath, 'wxss')}`;
  ensure(destWxss);
  write(destWxss, `@import '${getRelativePath(srcWxss, destWxss)}';
  ${COMP_WXSS}
  `);

  // gen js
  const destJs = `${examplePath}${modifySuffix(relativePath, 'js')}`;
  ensure(destJs);
  write(destJs, COMP_JS);

  parseFile(srcWxml, destWxml, options);
};

export {
  html2json,
  json2html,
};

export {
  getDir,
  getFileName,
  getPageWxml,
  getRelativePath,
  getSplitDir,
  identity,
  modifySuffix,
};
