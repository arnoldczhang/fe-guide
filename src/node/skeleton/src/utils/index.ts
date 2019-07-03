import * as css from 'css';
import { html2json, json2html } from 'html2json';
import { DomElement, DomHandler, Parser } from 'htmlparser2';
import { join } from 'path';
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
  exists,
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
import {
  removeComment,
  withoutPageSelector,
} from './reg';

import Logger from './log';

const {
  parse,
  stringify,
} = JSON;
const logger = Logger.getInstance();

export const html2ast = (rawHtml: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const parseHandler: DomHandler = new DomHandler((error: any, dom: DomElement[]): any => {
      if (error) {
        reject(error);
      } else {
        resolve(dom);
      }
    });
    const parser: Parser = new Parser(parseHandler);
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
  const content: string = removeComment(String(read(dest)));
  const json: ICO = html2json(content);
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

export const isNpmComponent = (path: string): boolean => /^~@/.test(path);

export const getJsonValue = (path: string, key: string): ICO | false => {
  try {
    const content: string = String(read(path));
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
): void => {
  ensure(dest);
  srcContent = srcContent || String(read(src));
  let usingComponent: ICO | false = getJsonValue(src, JSON_CONFIG.USING);
  if (usingComponent) {
    usingComponent = parseFromJSON(
      src,
      dest,
      usingComponent,
      options,
    );
    const compJson: ICO = parse(srcContent);
    compJson[JSON_CONFIG.USING] = usingComponent;
    write(dest, stringify(compJson, null, 2));
  } else {
    write(dest, srcContent);
  }
  logger.note(dest);
};

export const ensureAndInsertWxss = (src: string, dest: string): void => {
  if (exists(src)) {
    ensure(dest);
    write(dest, insertInitialWxss(`@import '${getRelativePath(src, dest)}';`));
    logger.note(dest);
  }
};

export const insertPageWxss = (src: string, dest: string): void => {
  ensure(dest);
  const content: string = String(read(src));
  const ast: css.Stylesheet = css.parse(content);
  const { rules } = ast.stylesheet;
  let hasPageStyle: boolean = false;
  rules.forEach((
    rule: css.Rule & css.Import,
    index: number,
    ruleArray: Array<css.Rule & css.Import>,
  ) => {
    const { type, selectors } = rule;
    /*
    {
      type: 'import',
      import: '"../../components/xx/xx.wxss"'
    }
    */
    if (type === 'import') {
      const srcPath: string = join(getDir(src), rule.import.slice(1, -1));
      rule.import = `"${getRelativePath(srcPath, dest)}"`;
    /*
    {
      type: 'rule',
      selectors: [ '.loading-data', '.no-data' ]
    }
    */
    } else if (type === 'rule') {
      selectors.forEach((
        selector: string,
        idx: number,
        selectorArray: string[],
        ) => {
        const tmpSelectors: string[] = selector.split(/\s/);
        const lastSelector: string = tmpSelectors[tmpSelectors.length - 1];
        if (!withoutPageSelector(lastSelector)) {
          selectorArray.splice(idx, 1);
          hasPageStyle = true;
        }
      });

      if (!selectors.length) {
        ruleArray.splice(index, 1);
      }
    }
  });

  if (hasPageStyle) {
    write(dest, insertInitialWxss(`${css.stringify(ast)}`));
  } else {
    ensureAndInsertWxss(src, dest);
  }
};

export const genNewComponent = (
  srcWxml: string,
  options: IPath,
): void => {
  const { outputPath, srcPath } = options;
  const relativePath: string = srcWxml.replace(srcPath, '');
  const srcWxss: string = modifySuffix(srcWxml, 'wxss');
  const srcJson: string = modifySuffix(srcWxml, 'json');

  // gen wxml
  const destWxml: string = `${outputPath}${relativePath}`;
  ensure(destWxml);
  copy(srcWxml, destWxml);
  write(
    destWxml,
    parseFile(srcWxml, destWxml, options),
  );
  logger.note(destWxml);

  // gen json
  const destJson: string = `${outputPath}${modifySuffix(relativePath, 'json')}`;
  updateUsingInJsonConfig(srcJson, destJson, options, COMP_JSON);

  // gen wxss
  const destWxss: string = `${outputPath}${modifySuffix(relativePath, 'wxss')}`;
  insertPageWxss(srcWxss, destWxss);

  // gen js
  const destJs: string = `${outputPath}${modifySuffix(relativePath, 'js')}`;
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
