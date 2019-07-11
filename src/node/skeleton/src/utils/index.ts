import * as css from 'css';
import { html2json, json2html } from 'html2json';
import { DomElement, DomHandler, Parser } from 'htmlparser2';
import { join } from 'path';
import {
  COMP_JS,
  COMP_JSON,
  COMP_WXSS,
  DEFAULT_WXSS,
  JSON_CONFIG,
  TEXT,
} from '../config';
import { COMMENT_TAG, IMPORT_TAG, INCLUDE_TAG, RULE_TAG, TEMPLATE_TAG } from '../config/tag';
import { IAst, ICO, IPath } from '../types';
import { is } from './assert';
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
  copy,
  ensure,
  exists,
  read,
  write,
} from './fs';
import {
  matchIdStyle,
  removeComment,
  withoutPageSelector,
} from './reg';
import { parseAsTreeNode, parseFromJSON } from './treeNode';

import Logger from './log';
import { styleTreeShake } from './treeshake';

const {
  parse,
  stringify,
} = JSON;
const logger = Logger.getInstance();

/**
 * html2ast
 * @param rawHtml
 */
export const html2ast = (rawHtml: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const parseHandler: DomHandler = new DomHandler((
      error: any,
      dom: DomElement[],
    ): any => {
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

/**
 * treewalk
 * @param ast
 * @param options
 */
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

/**
 * parseFile
 * @param src
 * @param dest
 * @param options
 */
export const parseFile = (
  src: string,
  dest: string,
  options: IPath,
): string => {
  try {
    const content: string = removeComment(String(read(dest)));
    const json: ICO = html2json(content);
    return json2html(treewalk(json, {
      ...options,
      protoPath: getDir(src),
      mainPath: getDir(dest),
      mainFilePath: dest,
    }));
  } catch ({ message }) {
    logger.warn(message);
    return '';
  }
};

/**
 * insertInitialWxss
 * @param template
 * @param wxss
 */
export const insertInitialWxss = (
  template: string,
  wxss?: string,
): string => {
  wxss = wxss || COMP_WXSS;
  return `${template}
${wxss}`;
};

/**
 * getJsonValue
 * @param path
 * @param key
 */
export const getJsonValue = (
  path: string,
  key: string,
): ICO | false => {
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

/**
 * updateUsingInJsonConfig
 * @param src
 * @param dest
 * @param options
 * @param srcContent
 */
export const updateUsingInJsonConfig = (
  src: string,
  dest: string,
  options: IPath,
  srcContent?: string,
): void => {
  try {
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
  } catch ({ message }) {
    logger.warn(message);
  }
};

/**
 * ensureAndInsertWxss
 * @param src
 * @param dest
 */
export const ensureAndInsertWxss = (
  src: string,
  dest: string,
  options: IPath,
): void => {
  if (exists(src)) {
    ensure(dest);
    write(dest, insertInitialWxss(`@import '${getRelativePath(src, dest)}';`));
  }
};

/**
 * ensureAndInsertWxml
 * @param src
 * @param dest
 * @param options
 */
export const ensureAndInsertWxml = (
  src: string,
  dest: string,
  options?: IPath,
): void => {
  ensure(dest);
  copy(src, dest);
  write(
    dest,
    parseFile(src, dest, options),
  );
  if (options.verbose) {
    logger.await(dest);
  }
};

/**
 * insertPageWxss
 * @param src
 * @param dest
 */
export const insertPageWxss = (
  src: string,
  dest: string,
  options: IPath,
): void => {
  ensure(dest);
  const { wxmlKlassInfo } = options;
  const content: string = String(exists(src) ? read(src) : '');
  const ast: css.Stylesheet = css.parse(content);
  const { rules } = ast.stylesheet;
  let hasPageStyle: boolean = false;

  rules.forEach((
    rule: css.Rule & css.Import,
    index: number,
  ) => {
    const { type, selectors } = rule;
    // { type: 'import', import: '"../../components/xx/xx.wxss"'}
    if (is(type, IMPORT_TAG)) {
      const srcPath: string = join(getDir(src), rule.import.slice(1, -1));
      rule.import = `"${getRelativePath(srcPath, dest)}"`;
   // { type: 'rule', selectors: [ '.loading-data', '.no-data' ]}
    } else if (is(type, RULE_TAG)) {
      const newSelectors: string[] = [];
      selectors.forEach((selector: string) => {
        const tmpSelectors: string[] = selector.split(/\s+/);
        const last = tmpSelectors.length - 1;
        const lastSelector: string = tmpSelectors[last];

        if (withoutPageSelector(lastSelector)) {
          newSelectors.push(selector);
        } else {
          // if matching id style, rewrite style if is used in wxml
          const matchResult = matchIdStyle(lastSelector);
          if (matchResult) {
            const id = matchResult[2];
            if (wxmlKlassInfo[id]) {
              tmpSelectors[last] = lastSelector.replace(id, wxmlKlassInfo[id]);
              return newSelectors.push(tmpSelectors.join(' '));
            }
          }
          hasPageStyle = true;
        }
      });

      if (!newSelectors.length) {
        rules[index] = null;
      }
      rule.selectors = newSelectors;
    }
  });
  ast.stylesheet.rules = styleTreeShake(rules.filter(identity), options);
  if (hasPageStyle) {
    write(dest, insertInitialWxss(`${css.stringify(ast)}`));
  } else {
    ensureAndInsertWxss(src, dest, options);
  }
};

/**
 * genNewComponent
 * @param srcWxml
 * @param options
 */
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
  ensureAndInsertWxml(srcWxml, destWxml, options);

  // gen json
  const destJson: string = `${outputPath}${modifySuffix(relativePath, 'json')}`;
  updateUsingInJsonConfig(srcJson, destJson, options, COMP_JSON);

  // gen wxss
  const destWxss: string = `${outputPath}${modifySuffix(relativePath, 'wxss')}`;
  insertPageWxss(srcWxss, destWxss, options);

  // gen js
  const destJs: string = `${outputPath}${modifySuffix(relativePath, 'js')}`;
  ensure(destJs);
  write(destJs, COMP_JS);
  if (options.verbose) {
    logger.success(getDir(srcWxml));
  }
};

/**
 * genResourceFile
 * @param resourceRoot
 */
export const genResourceFile = (resourceRoot: string): void => {
  ensure(resourceRoot);
  write(resourceRoot, DEFAULT_WXSS);
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
