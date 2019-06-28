import * as glob from 'glob';
import { DomElement, DomHandler, Parser } from 'htmlparser2';
import {
  JSON,
} from '../config';
import { IAst, ICO, IPath } from '../types';
import {
  copy,
  ensure,
  read,
  write,
} from './fs';
import { resolveAsTreeNode } from './treeNode';

import { html2json, json2html } from 'html2json';

export { html2json, json2html };

const examplePath = '/Users/dianping/website/skeleton-gen/examples/skeleton';

export const getPageWxml = (
  url: string,
  reg?: RegExp,
): string[] => {
  reg = reg || /pages\/([^\/]+)\/\1\.wxml$/;
  return glob.sync(url).filter((name) =>
    reg.test(name),
  ) || [];
};

export const getPageDir = (
  url: string,
  reg?: RegExp,
): string => {
  reg = reg || /\/[^\/]+$/;
  return url.replace(reg, '');
};

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

export const treewalk = (ast: IAst, options: IPath, cach?: ICO): IAst => {
  cach = cach || {};
  if (ast) {
    const { child } = ast;
    ast = resolveAsTreeNode(ast, options);
    if (child && child.length) {
      child.forEach((
        ch: IAst,
        idx: number,
        array: IAst[],
      ) => (
        array[idx] = treewalk(ch, options, cach)
      ));
    }
  }
  return ast;
};

export const modifySuffix = (file: string, suffix: string) => file.replace(/(\.)[^\.]+$/, `$1${suffix}`);

export const getRelativePath = (src: string, dest: string) => {
  console.log();
};

export const genNewComponent = (srcWxml: string, options: IPath) => {
  const { root, srcPath } = options;
  const relativePath = srcWxml.replace(srcPath, '');
  const wxml = `${examplePath}${relativePath}`;
  const json = `${examplePath}${modifySuffix(relativePath, 'json')}`;
  const wxss = `${examplePath}${modifySuffix(relativePath, 'wxss')}`;
  // ensure(wxml);
  // ensure(json);
  ensure(wxss);
  // write(json, JSON);
  // copy(srcWxml, wxml);
  write(wxss, `
  @import
  `);
  console.log(srcWxml, wxss);
  // const content = read(wxml);
  // const json = html2json(content);
  // const result = treewalk(json, {
  //   root,
  //   mainPath: getPageDir(wxml),
  //   mainFilePath: wxml,
  // });
};
