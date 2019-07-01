import { html2json, json2html } from 'html2json';
import { DomElement, DomHandler, Parser } from 'htmlparser2';
import {
  COMP_JS,
  COMP_JSON,
  COMP_WXSS,
  JSON_CONFIG,
} from '../config';
import { IAst, ICO, IPath } from '../types';
import {
  copy,
  ensure,
  read,
  write,
} from './fs';
import { parseAsTreeNode, parseFromJSON } from './treeNode';

import {
  addSuffix,
  getDir,
  getFileName,
  getPageWxml,
  getRelativePath,
  getSplitDir,
  identity,
  modifySuffix,
} from './dir';

import Logger from './log';

const {
  parse,
  stringify,
} = JSON;
const logger = Logger.getInstance();

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
): string => {
  const { root, srcPath } = options;
  const content = removeComment(String(read(dest)));
  const json = html2json(content);
  return json2html(treewalk(json, {
    root,
    srcPath,
    protoPath: getDir(src),
    mainPath: getDir(dest),
    mainFilePath: dest,
  }));
};

export const insertInitialWxss = (template: string, wxss?: string): string => {
  wxss = wxss || COMP_WXSS;
  return `${template}
${wxss}`;
};

export const removeComment = (file: string) => (
  file
    .replace(/(\/\*)((?!\1)[\s\S])*\*\//g, '')
    .replace(/(\/\*)((?!\*\/)[\s\S])*\*\//g, '')
    .replace(/(<!--)((?!\1)[\s\S])*-->/g, '')
    .replace(/(<!--)((?!-->)[\s\S])*-->/g, '')
    .replace(/(\s|^)\/\/.*/g, '$1')
);

export const isNpmComponent = (path: string): boolean => /^~@/.test(path);

export const getJsonValue = (path: string, key: string): ICO | false => {
  try {
    const content = String(read(path));
    let json = parse(content);
    if (key) {
      json = json[key];
    }
    return json;
  } catch (error) {
    return false;
  }
};

export const updateUsingInJsonConfig = (
  src: string,
  dest: string,
  options: IPath,
  srcContent?: string,
) => {
  ensure(dest);
  srcContent = srcContent || String(read(src));
  let usingComponent = getJsonValue(src, JSON_CONFIG.USING);
  if (usingComponent) {
    usingComponent = parseFromJSON(
      src,
      dest,
      usingComponent,
      options,
    );
    const compJson = parse(srcContent);
    compJson[JSON_CONFIG.USING] = usingComponent;
    write(dest, stringify(compJson, null, 2));
  } else {
    write(dest, srcContent);
  }
  logger.note(dest);
};

export const genNewComponent = (
  srcWxml: string,
  options: IPath,
): void => {
  const { examplePath, srcPath } = options;
  const relativePath = srcWxml.replace(srcPath, '');
  const srcWxss = modifySuffix(srcWxml, 'wxss');
  const srcJson = modifySuffix(srcWxml, 'json');

  // gen wxml
  const destWxml = `${examplePath}${relativePath}`;
  ensure(destWxml);
  copy(srcWxml, destWxml);
  write(
    destWxml,
    parseFile(srcWxml, destWxml, options),
  );
  logger.note(destWxml);

  // gen json
  const destJson = `${examplePath}${modifySuffix(relativePath, 'json')}`;
  updateUsingInJsonConfig(srcJson, destJson, options, COMP_JSON);

  // gen wxss
  const destWxss = `${examplePath}${modifySuffix(relativePath, 'wxss')}`;
  ensure(destWxss);
  write(destWxss, insertInitialWxss(`@import '${getRelativePath(srcWxss, destWxss)}';`));
  logger.note(destWxss);

  // gen js
  const destJs = `${examplePath}${modifySuffix(relativePath, 'js')}`;
  ensure(destJs);
  write(destJs, COMP_JS);
  logger.note(destJs);
};

export {
  html2json,
  json2html,
};

export {
  addSuffix,
  getDir,
  getFileName,
  getPageWxml,
  getRelativePath,
  getSplitDir,
  identity,
  modifySuffix,
};
