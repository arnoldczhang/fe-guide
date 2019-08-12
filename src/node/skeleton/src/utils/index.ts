import * as css from 'css';
import { html2json, json2html } from 'html2json';
import { DomElement, DomHandler, Parser } from 'htmlparser2';
import { join } from 'path';
import {
  COMP_JS,
  COMP_JSON,
  COMP_WXSS,
  DEFAULT_WXSS,
  getCompJs,
  JSON_CONFIG,
  PATH,
  TEXT,
} from '../config';
import { COMMENT_TAG, IMPORT_TAG, INCLUDE_TAG, RULE_TAG, TEMPLATE_TAG } from '../config/tag';
import { IAst, ICO, IComp, IPath, IUnused } from '../types';
import { is, isArr } from './assert';
import {
  hasCach,
  setCach,
} from './cach';
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
  remove,
  write,
} from './fs';
import { parseAsTreeNode, parseFromJSON } from './parser';
import {
  addSuffixWxss,
  getTemplateIs,
  getTemplateName,
  isGenWxss,
  matchIdStyle,
  removeComment,
  replacePseudo,
  splitWith,
  withoutPageSelector,
} from './reg';

import { Comp } from './klass';
import Logger from './log';
import { styleTreeShake, wxmlTreeShake } from './treeshake';

const {
  parse,
  stringify,
} = JSON;
const emptyNode = {};
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
 * @param isPage
 */
export const treewalk = (
  ast: IAst,
  options: IPath,
  isPage?: boolean,
): IAst => {
  if (ast) {
    ast = parseAsTreeNode(ast, { ...options, isPage });
    const { child } = ast;
    if (child && child.length) {
      child.forEach((
        ch: IAst,
        idx: number,
        chs: IAst[],
      ): void => {
        chs[idx] = treewalk(ch, options, isPage);
        chs[idx].parent = ast;
        (chs[idx + 1] || {}).sibling = chs[idx];
      });
    }
  }
  return ast;
};

/**
 * parseFile
 * @param src
 * @param dest
 * @param options
 * @param isPage
 */
export const parseFile = (
  src: string,
  dest: string,
  options: IPath,
  isPage?: boolean,
): string => {
  try {
    const { treeshake } = options;
    let content: string = removeComment(read(src) as string);
    if (treeshake) {
      content = wxmlTreeShake(content, src, { ...options, isPage });
    }
    const json: ICO = html2json(content);
    return json2html(treewalk(json, {
      ...options,
      protoPath: getDir(src),
      mainPath: getDir(dest),
      mainFilePath: dest,
    }, isPage));
  } catch (err) {
    logger.warn(err);
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
  wxss = COMP_WXSS,
): string => (
  `${template}
${wxss}`
);

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
 * @param isPage
 */
export const updateUsingInJsonConfig = (
  src: string,
  dest: string,
  options: IPath,
  srcContent?: string,
  isPage?: boolean,
): void => {
  try {
    ensure(dest);
    srcContent = srcContent || String(read(src));
    let usingComponent: ICO | false = getJsonValue(src, JSON_CONFIG.USING);
    if (usingComponent) {
      usingComponent = parseFromJSON(src, dest, usingComponent, options, isPage);
      const compJson: ICO = parse(srcContent);
      compJson[JSON_CONFIG.USING] = usingComponent;
      write(dest, stringify(compJson, null, 2));
    } else {
      write(dest, srcContent);
    }
  } catch (err) {
    logger.warn(err);
  }
};

/**
 * updateUnusedJsonConfig
 * @param dest
 * @param map
 */
export const updateUnusedJsonConfig = (
  dest: string,
  map: Map<string, Comp>,
): void => {
  if (map.size) {
    const content: string = read(dest) as string;
    const parseContent: ICO = parse(content);
    const keyIterator: IterableIterator<string> = map.keys();
    let next: IteratorResult<string> = keyIterator.next();
    while (!next.done) {
      delete parseContent[JSON_CONFIG.USING][next.value];
      next = keyIterator.next();
    }
    write(dest, stringify(parseContent));
  }
};

/**
 * iterateUpdateUnusedWxmlConfig
 * @param ast
 * @param imports
 */
export const iterateUpdateUnusedWxmlConfig = (
  ast: IAst,
  imports: string[],
): IAst => {
  const { tag, attr, child } = ast;
  const hasAttr = attr && attr.src && imports.includes(attr.src);
  if (is(tag, IMPORT_TAG) && hasAttr) {
    return emptyNode;
  }
  if (child) {
    child.forEach((ch: IAst, idx: number, arr: IAst[]) => {
      arr[idx] = iterateUpdateUnusedWxmlConfig(ch, imports);
    });
  }
  return ast;
};

/**
 * updateUnusedWxmlConfig
 * @param dest
 * @param map
 */
export const updateUnusedWxmlConfig = (
  dest: string,
  map: Map<string, string[]>,
): void => {
  const values = [...map.values()].map((paths: string[]) => paths[0]);
  const content: string = read(dest) as string;
  let ast = html2json(content);
  ast = iterateUpdateUnusedWxmlConfig(ast, values);
  write(dest, json2html(ast));
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
    write(dest, insertInitialWxss(`@import "${getRelativePath(src, dest)}";`));
  }
};

/**
 * ensureAndInsertWxml
 * @param src
 * @param dest
 * @param options
 * @param isPage
 */
export const ensureAndInsertWxml = (
  src: string,
  dest: string,
  options?: IPath,
  isPage?: boolean,
): void => {
  ensure(dest);
  write(
    dest,
    parseFile(src, dest, options, isPage),
  );
  if (options.verbose) {
    logger.await(dest);
  }
};

/**
 * isImportedWxssInvalid
 * @param src
 */
export const isImportedWxssInvalid = (
  src: string,
): boolean => {
  const content: string = String(exists(src) ? read(src) : '');
  const ast: css.Stylesheet = css.parse(content);
  const { rules } = ast.stylesheet;
  return rules.some((rule: css.Rule & css.Import) => {
    const { type, selectors } = rule;
    if (is(type, RULE_TAG)) {
      return selectors.some((selector: string) => {
        const tmpSelectors: string[] = splitWith(selector);
        const lastSelector: string = tmpSelectors[tmpSelectors.length - 1];
        if (!withoutPageSelector(lastSelector)) {
          logger.warn(`wxss: [${src}] has invalid components style [${selector}], pls remove`);
          return true;
        }
        return false;
      });
    } else if (is(type, IMPORT_TAG)) {
      const srcPath: string = join(getDir(src), rule.import.slice(1, -1));
      return isImportedWxssInvalid(srcPath);
    }
    return false;
  });
};

/**
 * filterUsableSelectors
 * @param selectors
 * @param options
 */
export const filterUsableSelectors = (
  selectors: string[],
  options: IPath,
): [boolean, string[]] => {
  let filtered = false;
  const { wxmlKlassInfo = {} } = options;
  const newSelectors: string[] = [];
  // selectors: [ '.loading-data', '.no-data' ]
  selectors.forEach((selector: string): void => {
    // .a .b #c
    const tmpSelectors: string[] = splitWith(selector);
    const tmpLen = tmpSelectors.length;
    tmpSelectors.forEach((tmp: string, idx: number): void => {
      const last = tmpLen === idx + 1;
      // no id/tag/pseudo style
      if (withoutPageSelector(tmp)) {
        if (last) {
          newSelectors.push(tmpSelectors.join(' '));
        }
        return;
      } else {
        filtered = true;
        tmp = replacePseudo(tmp);
        // last selector contain pseudo style
        if (last && !tmp) {
          return;
        }
        const idMatchResult = matchIdStyle(tmp);
        // if matching id style, rewrite style if is used in wxml
        if (idMatchResult) {
          const id = idMatchResult[2];
          tmpSelectors[idx] = wxmlKlassInfo[id] && tmp.replace(id, wxmlKlassInfo[id]) || '';
          if (last) {
            newSelectors.push(tmpSelectors.join(' '));
          }
        }
      }
    });
  });
  return [filtered, newSelectors.filter(identity)];
};

/**
 * insertPageWxss
 * @param src
 * @param dest
 * @param options
 */
export const insertPageWxss = (
  src: string,
  dest: string,
  options: IPath,
): void => {
  if (hasCach(dest, PATH)) {
    return;
  }
  setCach(dest, 1, PATH);
  ensure(dest);
  const { treeshake, tplWxss } = options;
  const content: string = String(exists(src) ? read(src) : '');
  const ast: css.Stylesheet = css.parse(content);
  let { rules } = ast.stylesheet;
  let hasPageStyle: boolean = false;

  rules.forEach((
    rule: css.Rule & css.Import,
    index: number,
  ): void => {
    const { type, selectors } = rule;
    // { type: 'import', import: '"../../components/xx/xx.wxss"'}
    if (is(type, IMPORT_TAG)) {
      const tplSrc: string = join(getDir(src), rule.import.slice(1, -1));
      const newTplSrc = addSuffixWxss(tplSrc);
      const relativeTplSrc = getRelativePath(tplSrc, dest);
      // check template/components wxss is invalid or not
      const invalid = isImportedWxssInvalid(tplSrc);
      if (tplWxss) {
        if (!invalid) {
          rule.import = `"${relativeTplSrc}"`;
          removeImportedWxss(newTplSrc);
        // generate new wxss if origin wxss is invalid
        } else {
          hasPageStyle = true;
          insertPageWxss(tplSrc, newTplSrc, { ...options, treeshake: false });
          rule.import = `"${getRelativePath(newTplSrc, dest)}"`;
        }
      } else {
        rule.import = `"${relativeTplSrc}"`;
      }
    // { type: 'rule', selectors: [ '.loading-data', '.no-data' ]}
    } else if (is(type, RULE_TAG)) {
      const [filtered, newSelectors] = filterUsableSelectors(selectors, options);
      hasPageStyle = filtered || hasPageStyle;
      if (!newSelectors.length) {
        rules[index] = null;
      }
      rule.selectors = newSelectors;
    }
  });
  rules = rules.filter(identity);
  // wxss treeshake on/off
  ast.stylesheet.rules = treeshake ? styleTreeShake(rules, options) : rules;

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
  const { outputPath, srcPath, deleteUnused, usingComponentKeys, usingTemplateKeys } = options;
  const relativePath: string = srcWxml.replace(srcPath, '');
  const srcWxss: string = modifySuffix(srcWxml, 'wxss');
  const srcJson: string = modifySuffix(srcWxml, 'json');
  // gen json
  const destJson: string = `${outputPath}${modifySuffix(relativePath, 'json')}`;
  updateUsingInJsonConfig(srcJson, destJson, options, COMP_JSON, true);

  // gen wxml
  const destWxml: string = `${outputPath}${relativePath}`;
  ensureAndInsertWxml(srcWxml, destWxml, options, true);

  // gen wxss
  const destWxss: string = `${outputPath}${modifySuffix(relativePath, 'wxss')}`;
  insertPageWxss(srcWxss, destWxss, options);

  // gen js
  const destJs: string = `${outputPath}${modifySuffix(relativePath, 'js')}`;
  ensure(destJs);
  write(destJs, getCompJs(outputPath, destJs));

  // clear unused component in json file
  if (deleteUnused) {
    updateUnusedJsonConfig(destJson, usingComponentKeys);
    updateUnusedWxmlConfig(destWxml, usingTemplateKeys);
  }

  // show log
  if (options.verbose) {
    logger.success(getDir(srcWxml));
  }
};

/**
 * genResourceFile
 * @param resourceRoot
 * @param content
 */
export const genResourceFile = (
  resourceRoot: string,
  content: string,
): void => {
  ensure(resourceRoot);
  write(resourceRoot, content);
};

/**
 * transMap2Style
 * @param maps
 */
export const transMap2Style = (
  ...maps: Array<Map<string, string>>
): string => {
  let result = '';
  maps.forEach((map: Map<string, string>): void => {
    const keys: IterableIterator<string> = map.keys();
    for (const key of keys) {
      if (isArr(key)) {
        result += `${key.map((k: string) => `${k.indexOf('@') ? '.' : ''}${k}`).join()} { ${map.get(key)} }\n`;
      } else {
        result += `${key.indexOf('@') ? '.' : ''}${key} {${map.get(key)}}\n`;
      }
    }
  });
  return result;
};

/**
 * getTplKey
 * @param key
 * @param path
 */
export const getTplKey = (
  key: string,
  path: string,
): string => `${key}$${path}`;

/**
 * updateTemplateInfo
 * @param src
 * @param dest
 * @param options
 */
export const updateTemplateInfo = (
  src: string,
  dest: string[],
  options: IPath,
): void => {
  const { parentTpl, usingTemplateKeys, wxTemplateInfo } = options;
  const content: string = read(src) as string;
  const names = getTemplateName(content);
  const iss = getTemplateIs(content);
  const tplName = names.filter((name: string): boolean => !iss.includes(name))[0];
  const [, absolutePath] = dest;
  const tpl = new Comp(tplName, absolutePath, src);
  usingTemplateKeys.set(tplName, dest);
  wxTemplateInfo.set(getTplKey(tplName, absolutePath), tpl);
  if (parentTpl) {
    parentTpl.addChild(tpl);
  }
  options.parentTpl = tpl;
};

/**
 * removeUnused
 * @param param0
 */
export const removeUnused = ({
  template,
  component,
}: IUnused): void => {
  // remove unused component
  component.forEach((fileName: string): void => {
    const dir = getDir(fileName);
    remove(dir);
  });

  // remove unused template
  template.forEach((tpl) => {
    const { path } = tpl;
    const wxss = modifySuffix(path, 'wxss');
    const tplWxss = addSuffixWxss(wxss);
    remove(path);
    // remove wxss if exists
    if (exists(wxss)) { remove(wxss); }
    // remove invalid wxss if exists
    if (exists(tplWxss)) { remove(tplWxss); }
  });
};

/**
 * clearUsedComp
 * @param tag
 * @param options
 */
export const clearUsedComp = (
  tag: string,
  options: IPath,
): void => {
  const { usingComponentKeys, wxComponentInfo } = options;
  const thisComp = usingComponentKeys.get(tag);
  if (thisComp) {
    const { path } = thisComp;
    wxComponentInfo.delete(path);
    usingComponentKeys.delete(tag);
    thisComp.iterateChild((ch: Comp): void => {
      wxComponentInfo.delete(ch.path);
      usingComponentKeys.delete(ch.tag);
    });
  }
};

/**
 * clearUsedTpl
 * @param key
 * @param options
 */
export const clearUsedTpl = (
  key: string,
  options: IPath,
): void => {
  const { usingTemplateKeys, wxTemplateInfo } = options;
  const dest = usingTemplateKeys.get(key);
  if (dest) {
    const [, destValue] = dest;
    if (destValue) {
      usingTemplateKeys.delete(key);
      const tplKey = getTplKey(key, destValue);
      const thisTpl = wxTemplateInfo.get(tplKey);
      wxTemplateInfo.delete(tplKey);
      if (thisTpl) {
        thisTpl.iterateChild((ch: Comp): void => {
          usingTemplateKeys.delete(ch.tag);
          wxTemplateInfo.delete(getTplKey(ch.tag, ch.path));
        });
      }
    }
  }
};

/**
 * hasOnlyTextChild
 * @param ast
 */
export const hasOnlyTextChild = (
  ast: IAst,
): boolean => {
  const { child } = ast;
  let result = false;
  if (child && child.length === 1) {
    const { node, tag } = child[0];
    result = !tag && is(node, TEXT);
  }
  return result;
};

/**
 * removeImportedWxss
 * @param src
 */
export const removeImportedWxss = (
  src: string,
): void => {
  if (exists(src)) {
    const content: string = String(exists(src) ? read(src) : '');
    const ast: css.Stylesheet = css.parse(content);
    const { rules } = ast.stylesheet;

    rules.forEach((
      rule: css.Rule & css.Import,
    ): void => {
      const { type, import: importAttr } = rule;
      // { type: 'import', import: '"../../components/xx/xx.wxss"'}
      if (is(type, IMPORT_TAG)) {
        if (isGenWxss(importAttr)) {
          const importedSrc: string = join(getDir(src), importAttr.slice(1, -1));
          removeImportedWxss(importedSrc);
        }
      }
    });
    remove(src);
  }
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
