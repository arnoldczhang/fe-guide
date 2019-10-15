import { NodePath } from '@babel/traverse';
import * as t from "@babel/types";
import { join, resolve } from 'path';
import * as pathResolve from 'resolve';
import { createExpressionWithTypeArguments, transform } from 'typescript';
import { isString } from 'util';
import {
  ATTR_BG,
  ATTR_CLEAR,
  ATTR_DARK_BG,
  ATTR_FOR,
  ATTR_HEIGHT,
  ATTR_LIGHT_BG,
  ATTR_MARGIN,
  ATTR_MARGIN_BOTTOM,
  ATTR_MARGIN_LEFT,
  ATTR_MARGIN_RIGHT,
  ATTR_MARGIN_TOP,
  ATTR_PADDING,
  ATTR_PADDING_BOTTOM,
  ATTR_PADDING_LEFT,
  ATTR_PADDING_RIGHT,
  ATTR_PADDING_TOP,
  ATTR_RADIUS,
  ATTR_REMOVE,
  ATTR_REPEAT,
  ATTR_REPLACE,
  ATTR_SHOW,
  ATTR_TEXT,
  ATTR_WIDTH,
  BUTTON_TAG,
  COMP_JS,
  COMP_WXSS,
  ELEMENT_TAG,
  getCompJs,
  IMAGE_TAG,
  IMPORT_TAG,
  INCLUDE_TAG,
  JSON_CONFIG,
  KLASS,
  KLASS_NAME,
  PATH,
  PRE,
  ROOT_TAG,
  TARO_TAG,
  TEMPLATE_TAG,
  TEXT,
  TPL_TAG,
  WX_ELIF,
  WX_ELSE,
  WX_FOR,
  WX_FOR_INDEX,
  WX_HIDDEN,
  WX_IF,
  WX_KEY,
  WXS_TAG,
  WXSS_BG_GREY,
} from '../config';
import { CF, IAst, ICO, IPath } from '../types';
import {
  triggerBgAction,
  triggerBorderRadiusAction,
  triggerDarkBgAction,
  triggerHeightAction,
  triggerLightBgAction,
  triggerMarginAction,
  triggerMarginBottomAction,
  triggerMarginLeftAction,
  triggerMarginRightAction,
  triggerMarginTopAction,
  triggerPaddingAction,
  triggerPaddingBottomAction,
  triggerPaddingLeftAction,
  triggerPaddingRightAction,
  triggerPaddingTopAction,
  triggerReplaceAction,
  triggerWidthAction,
} from './action';
import { has, is, isArr, isFalsy, isStr, isTrue } from './assert';
import {
  parseAstBg,
  parseAstClear,
  parseAstDarkBg,
  parseAstFor,
  parseAstHeight,
  parseAstKlass,
  parseAstLightBg,
  parseAstMargin,
  parseAstMarginBottom,
  parseAstMarginLeft,
  parseAstMarginRight,
  parseAstMarginTop,
  parseAstPadding,
  parseAstPaddingBottom,
  parseAstPaddingLeft,
  parseAstPaddingRight,
  parseAstPaddingTop,
  parseAstRadius,
  parseAstRemove,
  parseAstReplace,
  parseAstShow,
  parseAstText,
  parseAstWidth,
} from './ast';
import {
  babelConfig,
  babelParse,
  generate,
  transform as babelTransform,
} from './babel';
import {
  hasCach,
  setCach,
} from './cach';
import {
  findTsFileByPath,
  getDir,
  getFileName,
  getFoldPath,
  getRelativePath,
  removeSuffix,
} from './dir';
import {
  copy,
  ensure,
  exists,
  read,
  state,
  write,
} from './fs';
import {
  addSuffix,
  clearUsedComp,
  clearUsedTpl,
  ensureAndInsertWxml,
  ensureAndInsertWxss,
  genNewReactCustomComponent,
  hasOnlyTextChild,
  modifySuffix,
  updateTemplateInfo,
  updateUsingInJsonConfig,
} from './index';
import { Comp } from './klass';
import Logger from './log';
import {
  appendUniq,
  genKlass,
} from './random';
import {
  getTemplateName,
  hasSuffix,
  hasWxVariable,
  interceptWxVariable,
  isBindEvent,
  isCompMethod,
  isCssFile,
  isElif,
  isElse,
  isEvent,
  isHidden,
  isId,
  isIf,
  isKlass,
  isNpmComponent,
  isRelativePath,
  isSkeleton,
  isSkeletonStyle,
  isWxml,
  matchCallExpression,
  removeBlankAndWxVariable,
  replaceColorSymbol,
  replaceLengthSymbol,
  splitWith,
} from './reg';
import { cachKlassStruct } from './treeshake';

const {
  keys,
} = Object;
const logger = Logger.getInstance();

const getEmptyNode = () => ({});

/**
 * parseAsTreeNode
 * @param ast
 * @param options
 */
export const parseAsTreeNode = (
  ast: IAst,
  options: IPath,
): IAst => (
  [
    parseFromConfig,
    parseFromCustomAttr,
    parseFromAttr,
    parseFromTag,
    parseFromNode,
    parseFromStruct,
  ].reduce((res: IAst, next) => next(res, options), ast)
);

/**
 * parseFromConfig
 * @param ast
 * @param options
 */
const parseFromConfig = (
  ast: IAst,
  options: IPath,
): IAst => {
  const { ignoreTags } = options;
  if (ignoreTags && ignoreTags.includes(ast.tag)) {
    return getEmptyNode();
  }
  return ast;
};

/**
 * parseFromNode
 * @param ast
 * @param options
 */
export const parseFromNode = (
  ast: IAst,
  options: IPath,
): IAst => {
  const { node, text } = ast;
  if (node !== TEXT) {
    if (node === ROOT_TAG) {
      setRootShow(ast, options);
    }
    return ast;
  }
  ast.text = removeBlankAndWxVariable(text);
  return ast;
};

/**
 * parseFromCustomAttr
 * @param ast
 * @param options
 */
export const parseFromCustomAttr = (
  ast: IAst,
  options: IPath,
): IAst => {
  const { attr } = ast;
  if (!attr) { return ast; }
  const result: ICO = {};
  let attrKeys = keys(attr);
  const exceptKeys: string[] = [];
  for (let key, value, klass, i = 0; i < attrKeys.length; i += 1) {
    key = attrKeys[i];
    value = attr[key];
    klass = isStr(attr[KLASS]) ? [attr[KLASS]] : attr[KLASS] || [];
    switch (key) {
      // repeat
      // support 2 datatype:
      //  1. number / {{number}}
      //  2. variable which represents an array
      case ATTR_FOR:
      case ATTR_REPEAT:
        value = interceptWxVariable(value);
        result[WX_FOR] = isNaN(+value) ? `{{${value}}}` : `{{[${Array(+value).fill(1)}]}}`;
        result[WX_KEY] = `{{${attr[WX_FOR_INDEX] || 'index'}}}`;
        break;
      case ATTR_SHOW:
        result[WX_HIDDEN] = `{{false}}`;
        result[WX_IF] = '{{true}}';
        delete result[WX_ELIF];
        delete result[WX_ELSE];
        exceptKeys.push(WX_ELIF, WX_ELSE);
        break;
      case ATTR_REMOVE:
        return getEmptyNode();
      case ATTR_CLEAR:
        ast.child = [];
        break;
      case ATTR_REPLACE:
        attrKeys = Object.keys(triggerReplaceAction(ast, value));
        i = 0;
        break;
      case ATTR_PADDING:
        triggerPaddingAction(ast, options, result, value, klass);
        break;
      case ATTR_MARGIN:
        triggerMarginAction(ast, options, result, value, klass);
        break;
      case  ATTR_PADDING_TOP:
        triggerPaddingTopAction(ast, options, result, value, klass);
        break;
      case  ATTR_PADDING_BOTTOM:
        triggerPaddingBottomAction(ast, options, result, value, klass);
        break;
      case  ATTR_PADDING_LEFT:
        triggerPaddingLeftAction(ast, options, result, value, klass);
        break;
      case  ATTR_PADDING_RIGHT:
        triggerPaddingRightAction(ast, options, result, value, klass);
        break;
      case  ATTR_MARGIN_TOP:
        triggerMarginTopAction(ast, options, result, value, klass);
        break;
      case  ATTR_MARGIN_BOTTOM:
        triggerMarginBottomAction(ast, options, result, value, klass);
        break;
      case  ATTR_MARGIN_LEFT:
        triggerMarginLeftAction(ast, options, result, value, klass);
        break;
      case  ATTR_MARGIN_RIGHT:
        triggerMarginRightAction(ast, options, result, value, klass);
        break;
      case ATTR_WIDTH:
        triggerWidthAction(ast, options, result, value, klass);
        break;
      case ATTR_HEIGHT:
        triggerHeightAction(ast, options, result, value, klass);
        break;
      case ATTR_BG:
        triggerBgAction(ast, options, result, value, klass);
        break;
      case ATTR_DARK_BG:
        triggerDarkBgAction(ast, options, result, value, klass);
        break;
      case ATTR_LIGHT_BG:
        triggerLightBgAction(ast, options, result, value, klass);
        break;
      case ATTR_RADIUS:
        triggerBorderRadiusAction(ast, options, result, value, klass);
        break;
      case ATTR_TEXT:
        // TODO do nothing when is text now
        result[key] = value;
        break;
      default:
        if (!has(key, result) && !exceptKeys.includes(key)) {
          result[key] = value;
        }
        break;
    }
  }
  ast.attr = result;
  return ast;
};

/**
 * parseFromAttr
 * @param ast
 * @param options
 */
export const parseFromAttr = (
  ast: IAst,
  options: IPath,
): IAst => {
  const { attr, sibling } = ast;
  const { isPage, wxmlKlassInfo, treeshake } = options;
  if (!attr) { return ast; }
  const result: ICO = {};
  const attrKeys = keys(attr);
  for (let key, value, pureValue, i = 0; i < attrKeys.length; i += 1) {
    key = attrKeys[i];
    value = attr[key];
    pureValue = interceptWxVariable(value);
    switch (true) {
      // remove all events
      case isBindEvent(key):
        break;
      // hidden
      case treeshake && isHidden(key):
        if (!isFalsy(pureValue)) {
          return getEmptyNode();
        }
        result[key] = value;
        break;
      // wx:if
      // if this value eq false remove this element
      case treeshake && isIf(key):
        if (isFalsy(pureValue)) {
          return getEmptyNode();
        }
        result[key] = value;
        break;
      // wx:elif
      // if this value eq false, remove this element
      // else modify this attribute from `wx:elif` to `wx:if`
      case treeshake && isElif(key):
        if (isFalsy(pureValue)) {
          return getEmptyNode();
        } else if (isTrue(pureValue)) {
          result[WX_HIDDEN] = '{{false}}';
          result[WX_IF] = '{{true}}';
          break;
        } else {
          result[key] = value;
          break;
        }
      // wx:else
      // if pre sibling wx:if="{{true}}" remove this element
      // else remove this attribute `wx:else`
      case treeshake && isElse(key):
        let tmpSibling = sibling || {};
        if (!tmpSibling.node || !is(tmpSibling.node, ELEMENT_TAG)) {
          const preSibling = tmpSibling.sibling || {};
          // fix: find sibling by index of parent
          if (!preSibling.parent) {
            const { parent } = tmpSibling;
            if (parent) {
              const tmpIndex = parent.child.indexOf(tmpSibling);
              tmpSibling = parent.child[tmpIndex - 1] || {};
            }
          } else {
            tmpSibling = preSibling;
          }
        }
        const { node } = tmpSibling;
        const interceptValue = tmpSibling.attr && interceptWxVariable(tmpSibling.attr[WX_IF]);
        if (node && tmpSibling.attr && !isFalsy(interceptValue)) {
          return getEmptyNode();
        } else if (is(interceptValue, void 0)) {
          break;
        } else {
          result[key] = value;
          break;
        }
      // replace id(without wx variable) with a random class
      case isId(key):
        if (!hasWxVariable(value)) {
          const [klassName, klass] = genKlass();
          result.class = result.class || [];
          if (isArr(result.class)) {
            result.class.push(klassName);
          } else {
            result.class = [result.class, klassName];
          }
          wxmlKlassInfo[`#${value}`] = klass;
        }
        break;
      // class
      case isKlass(key):
        result.class = result.class || [];
        if (!value) {
          value = [];
        } else if (isString(value)) {
          value = [value];
        }
        result.class = value.concat(result.class);
        break;
      default:
        if (!has(key, result)) {
          result[key] = value;
        }
        break;
    }
  }
  ast.attr = result;
  return ast;
};

/**
 * parseFromStruct
 * @param ast
 * @param options
 */
export const parseFromStruct = (
  ast: IAst,
  options: IPath,
): IAst => {
  const { tag, attr } = ast;
  switch (true) {
    // <template />
    // cach template file for wxss treeshake
    case is(tag, TEMPLATE_TAG):
      if (attr && attr.name) {
        cachKlassStruct(`${TEMPLATE_TAG}.${attr.name}`, ast, options);
      }
      break;
    // cach class tag for wxss treeshake
    case !!(attr && attr.class):
      cachKlassStruct(attr.class, ast, options);
      break;
    default:
      break;
  }
  return ast;
};

/**
 * parseFromTag
 * @param ast
 * @param options
 */
export const parseFromTag = (
  ast: IAst,
  options: IPath,
): IAst => {
  const { tag, attr } = ast;
  const {
    defaultBg,
    protoPath,
    mainPath,
    skeletonKeys,
    usingComponentKeys,
    watch,
  } = options;
  if (!tag) { return ast; }
  const klass = attr && isStr(attr[KLASS]) ? [attr[KLASS]] : attr && attr[KLASS] || [];
  switch (true) {
    // <import />
    case is(tag, IMPORT_TAG):
      if (attr && attr.src) {
        let srcWxml: string = resolve(protoPath, attr.src);
        let destWxml: string = resolve(mainPath, attr.src);
        // fix: fill the omitted fileName
        if (!isWxml(srcWxml)) {
          srcWxml = `${srcWxml}/index.wxml`;
          destWxml = `${destWxml}/index.wxml`;
        }
        if (watch || !hasCach(destWxml, PATH)) {
          const srcWxss: string = modifySuffix(srcWxml, 'wxss');
          const destWxss: string = modifySuffix(destWxml, 'wxss');
          setCach(destWxml, 1, PATH);
          updateTemplateInfo(srcWxml, [attr.src, destWxml], options);
          ensureAndInsertWxml(srcWxml, destWxml, options);
          ensureAndInsertWxss(srcWxss, destWxss, options);
        }
      }
      break;
    // <template />
    case is(tag, TEMPLATE_TAG):
      if (attr.is) {
        clearUsedTpl(attr.is, options);
      }
      break;
    // <include />
    case is(tag, INCLUDE_TAG):
      if (attr && attr.src) {
        const srcWxml: string = resolve(protoPath, attr.src);
        const destWxml: string = resolve(mainPath, attr.src);
        if (watch || !hasCach(destWxml, PATH)) {
          setCach(destWxml, 1, PATH);
          ensureAndInsertWxml(srcWxml, destWxml, options);
        }
      }
      break;
    // <button />
    case is(tag, BUTTON_TAG):
      ast.tag = 'view';
      if (!attr) {
        ast.attr = {};
      }
      ast.attr[KLASS] = appendUniq(klass, WXSS_BG_GREY);
      break;
    // <image />
    case is(tag, IMAGE_TAG):
      if (!attr) {
        ast.attr = {};
      }
      ast.tag = 'view';
      if (ast.attr.src) {
        delete ast.attr.src;
      }
      if (ast.attr.mode) {
        delete ast.attr.mode;
      }
      ast.attr[KLASS] = appendUniq(klass, WXSS_BG_GREY);
      break;
    // remove <wxs />
    case is(tag, WXS_TAG):
      return getEmptyNode();
    // ignore skeleton tag
    // fix: compiling skeleton to skeleton
    case skeletonKeys.has(tag):
      return getEmptyNode();
    // if comp is used in pages, keep it
    case usingComponentKeys.has(tag):
      clearUsedComp(tag, options);
      break;
    default:
      // single element is filled with default bgcolor
      if (defaultBg && hasOnlyTextChild(ast)) {
        if (!attr) {
          ast.attr = {};
        }

        // won`t add default bgcolor when is text node
        if (ATTR_TEXT in ast.attr) {
          delete ast.attr[ATTR_TEXT];
          break;
        }
        ast.attr[KLASS] = appendUniq(klass, WXSS_BG_GREY);
      }
      break;
  }
  return ast;
};

/**
 * parseFromJSON
 * @param srcFile
 * @param destFile
 * @param json
 * @param options
 * @param isPage
 */
export const parseFromJSON = (
  srcFile: string,
  destFile: string,
  json: ICO,
  options: IPath,
  isPage?: boolean,
): ICO => {
  const {
    parentComp,
    usingComponentKeys,
    skeletonKeys,
    wxComponentInfo,
    watch,
  } = options;
  const src: string = getDir(srcFile);
  const dest: string = getDir(destFile);
  const { root, compPath, subPageRoot, outputPath } = options;
  const rootSrcPath = subPageRoot || options.srcPath;
  const backRE = /^\.{2}\//;

  keys(json).forEach((key: string): void => {
    let pathValue: string = json[key];
    let [srcJs, destJs, srcWxml, destWxml, srcWxss, destWxss, srcJson, destJson] = Array(10);
    try {
      // @npm/xxx
      if (isNpmComponent(pathValue)) {
        pathValue = pathValue.slice(1);
        srcJs = pathResolve.sync(pathValue, { basedir: root });
        const srcJsFileName: string = getFileName(srcJs);
        const [srcJsName] = splitWith(srcJsFileName, '.');
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
        const isRootStyle = /^\//.test(pathValue);
        let srcPre;
        let destPre;
        if (isRootStyle) {
          pathValue = pathValue.slice(1);
          srcPre = rootSrcPath;
          destPre = outputPath;
        } else {
          srcPre = src;
          destPre = dest;
        }
        let srcPath: string = resolve(srcPre, pathValue);
        let destPath: string = resolve(destPre, pathValue);

        // fix: avoid compiling skeleton to skeleton
        if (srcPath.includes(outputPath)) {
          delete json[key];
          skeletonKeys.add(key);
          return;
        }

        // fix: if component, located in main package, is used in subpackage,
        // this may be resolved to a out of bound path
        if (subPageRoot) {
          while (!destPath.includes(outputPath) && backRE.test(pathValue)) {
            pathValue = pathValue.replace(backRE, '');
            destPath = resolve(destPre, pathValue);
            json[key] = pathValue;
          }
        }

        try {
          if (state(srcPath).isDirectory()) {
            srcPath = `${srcPath}/index`;
            destPath = `${destPath}/index`;
          }
        } catch (err) {}
        srcJson = addSuffix(srcPath, 'json');
        destJson = addSuffix(destPath, 'json');
        srcJs = addSuffix(srcPath, 'js');
        destJs = addSuffix(destPath, 'js');
        srcWxml = addSuffix(srcPath, 'wxml');
        destWxml = addSuffix(destPath, 'wxml');
        srcWxss = addSuffix(srcPath, 'wxss');
        destWxss = addSuffix(destPath, 'wxss');
        json[key] = getRelativePath(destPath, destFile);
      }
    } catch (err) {
      return;
    }

    const thisComp: Comp = new Comp(key, destWxml, srcWxml);
    usingComponentKeys.set(key, thisComp);
    wxComponentInfo.add(destWxml);

    if (parentComp) {
      parentComp.addChild(thisComp);
    }

    if (watch || !hasCach(destWxml, PATH)) {
      // gen component-wxml
      setCach(destWxml, 1, PATH);
      ensureAndInsertWxml(srcWxml, destWxml, options);

      // gen component-json
      updateUsingInJsonConfig(srcJson, destJson, { ...options, parentComp: thisComp });

      // gen component-wxss
      ensureAndInsertWxss(srcWxss, destWxss, options);

      // gen component-js
      ensure(destJs);
      write(destJs, getCompJs(outputPath, destJs, options));

      // TODO copy Components.properties to destJs with babel
    }
  });
  return json;
};

/**
 * parseFromJSXElement
 * @param p
 * @param pagePath
 * @param options
 * @param map
 * @param set
 * @param methodMap
 */
export const parseFromJSXElement = (
  p: NodePath<t.JSXElement>,
  pagePath: string,
  options: IPath,
  map: Map<any[], [NodePath<any>, string]>,
  skeletonSet: Set<string>,
  methodMap: Map<string, NodePath<t.ClassMethod>>,
): void => {
  const { node } = p;
  const { defaultBg, resolvedReactCompKey } = options;
  const { openingElement, children } = node;
  const { name } = openingElement as any;

  // remove skeleton element
  if (name && name.name) {
    const openName = name.name;
    if (skeletonSet.has(openName)) {
      p.remove();
      const { parentPath } = p;
      if (t.isReturnStatement(parentPath)) {
        parentPath.remove();
      }
      return;
    }
    parseFromAstTag(p, map, options);
  }

  const { attributes } = openingElement;
  if (attributes && attributes.length) {
    attributes.forEach((
      a: t.JSXAttribute,
      i: number,
      innerAttributes: t.JSXAttribute[],
    ) => {
      parseFromAstAttr(i, innerAttributes, p, methodMap);
      parseFromAstCustomAttr(i, innerAttributes, p, options);
    });
    openingElement.attributes = attributes.filter((v: t.JSXAttribute | null) => v);
  }
};

/**
 * parseFromAstCustomAttr
 * @param index
 * @param attributes
 * @param p
 * @param options
 */
export const parseFromAstCustomAttr = (
  index: number,
  attributes: t.JSXAttribute[],
  p: NodePath<t.JSXElement>,
  options: IPath,
): void => {
  const attribute: t.JSXAttribute | null = attributes[index];
  if (!attribute) {
    return;
  }
  const attrName = attribute.name ? attribute.name.name : '';
  switch (attrName) {
    case ATTR_SHOW:
      parseAstShow(p, attribute, index, attributes, options);
      break;
    case ATTR_BG:
      parseAstBg(p, attribute, index, attributes, options);
      break;
    case ATTR_LIGHT_BG:
      parseAstLightBg(p, attribute, index, attributes, options);
      break;
    case ATTR_DARK_BG:
      parseAstDarkBg(p, attribute, index, attributes, options);
      break;
    case ATTR_HEIGHT:
      parseAstHeight(p, attribute, index, attributes, options);
      break;
    case ATTR_WIDTH:
      parseAstWidth(p, attribute, index, attributes, options);
      break;
    case ATTR_PADDING:
      parseAstPadding(p, attribute, index, attributes, options);
      break;
    case ATTR_PADDING_BOTTOM:
      parseAstPaddingBottom(p, attribute, index, attributes, options);
      break;
    case ATTR_PADDING_LEFT:
      parseAstPaddingLeft(p, attribute, index, attributes, options);
      break;
    case ATTR_PADDING_RIGHT:
      parseAstPaddingRight(p, attribute, index, attributes, options);
      break;
    case ATTR_PADDING_TOP:
      parseAstPaddingTop(p, attribute, index, attributes, options);
      break;
    case ATTR_MARGIN:
      parseAstMargin(p, attribute, index, attributes, options);
      break;
    case ATTR_MARGIN_BOTTOM:
      parseAstMarginBottom(p, attribute, index, attributes, options);
      break;
    case ATTR_MARGIN_LEFT:
      parseAstMarginLeft(p, attribute, index, attributes, options);
      break;
    case ATTR_MARGIN_RIGHT:
      parseAstMarginRight(p, attribute, index, attributes, options);
      break;
    case ATTR_MARGIN_TOP:
      parseAstMarginTop(p, attribute, index, attributes, options);
      break;
    case ATTR_CLEAR:
      parseAstClear(p, attribute, index, attributes, options);
      break;
    case ATTR_REMOVE:
      parseAstRemove(p, attribute, index, attributes, options);
      break;
    case ATTR_RADIUS:
      parseAstRadius(p, attribute, index, attributes, options);
      break;
    case ATTR_REPLACE:
      parseAstReplace(p, attribute, index, attributes, options);
      break;
    case ATTR_TEXT:
      parseAstText(p, attribute, index, attributes, options);
      break;
    case ATTR_REPEAT:
    case ATTR_FOR:
      parseAstFor(p, attribute, index, attributes, options);
      break;
    default:
      break;
  }
};

export const parseFromAstTag = (
  p: NodePath<t.JSXElement>,
  map: Map<any[], [NodePath<any>, string]>,
  options: IPath,
): void => {
  const { resolvedReactCompKey, defaultBg } = options;
  const { node } = p;
  const { openingElement, closingElement, children } = node;
  const { name } = openingElement as any;
  let { attributes = [] } = openingElement as any;
  const openName = name.name;

  switch (true) {
    // parse <Image> to <View>
    case is(openName, TARO_TAG.Image):
      (openingElement.name as t.JSXIdentifier).name = TARO_TAG.View;
      if (closingElement) {
        (closingElement.name as t.JSXIdentifier).name = TARO_TAG.View;
      }
      attributes = attributes.map((attribute: t.JSXAttribute) => {
        const klassAttr = attribute && attribute.name
          && is(attribute.name.name, KLASS_NAME);
        if (klassAttr) {
          return attribute;
        }
        return null;
      });
      parseAstKlass(WXSS_BG_GREY, attributes);
      openingElement.attributes = attributes;
      return;
    // parse custom-component
    default:
      if (!TARO_TAG[openName] && !resolvedReactCompKey.has(openName)) {
        genNewReactCustomComponent(openName as string, map, options);
        return;
      }
      break;
  }

  // when to add default background
  // 1. element has no child
  // 2. element`s children is all JSXText
  // 3. element is <Text />
  const defaultBgElement = defaultBg
    && (
      children.length === 0
        || children.every((child) => t.isJSXText(child))
        || is(openName, TARO_TAG.Text)
    );

  // if is empty element or has only one text child
  if (defaultBgElement) {
    parseAstKlass(WXSS_BG_GREY, attributes);
  }
};

/**
 * parseFromAstAttr
 * @param index
 * @param attributes
 * @param p
 * @param map
 */
export const parseFromAstAttr = (
  index: number,
  attributes: t.JSXAttribute[],
  p: NodePath<t.JSXElement>,
  map: Map<string, NodePath<t.ClassMethod>>,
): void => {
  const attribute = attributes[index];
  if (!attribute) {
    return;
  }
  const attrName = String(attribute.name ? attribute.name.name : '');
  switch (true) {
    case isEvent(attrName):
      const { code } = generate(attribute.value as babel.types.Node);
      const methods = matchCallExpression(code);
      methods.forEach((methodName: string) => {
        const nodePath: NodePath<t.ClassMethod> | void = map.get(methodName);
        if (nodePath) {
          nodePath.remove();
          map.delete(methodName);
        }
      });
      attributes[index] = null;
      break;
    default:
      break;
  }
};

/**
 * parseFromClassMethod
 * @param p
 * @param options
 * @param map
 */
export const parseFromClassMethod = (
  p: NodePath<t.ClassMethod>,
  options: IPath,
  map: Map<string, NodePath<t.ClassMethod>>,
): void => {
  const { node } = p;
  const { key } = node;
  const { name = '' } = key as any;
  if (isCompMethod(name)) {
    p.remove();
  } else {
    map.set(name, p);
  }
};

/**
 * parseFromImportDeclaration
 * @param p
 * @param pagePath
 * @param options
 * @param map
 * @param set
 */
export const parseFromImportDeclaration = (
  p: NodePath<t.ImportDeclaration>,
  pagePath: string,
  options: IPath,
  map: Map<string[], [NodePath<any>, string]>,
  set: Set<string>,
): void => {
  let absoluteImportPath;
  const { node } = p;
  const { leadingComments, source, specifiers = [] } = node;
  const { value } = source;
  const { outputPagePath, globalScssPath, root } = options;

  if (isRelativePath(value)) {
    const foldPath = getFoldPath(pagePath);
    absoluteImportPath = findTsFileByPath(resolve(foldPath, value));
    const relativeImportPath = getRelativePath(absoluteImportPath, outputPagePath);
    // skip skeleton.scss
    if (isSkeletonStyle(relativeImportPath)) {
      return;
    }
    const cssFlag = isCssFile(relativeImportPath);
    source.value = !cssFlag ? removeSuffix(relativeImportPath) : relativeImportPath;
    // insert global skeleton.scss after any .scss
    if (cssFlag) {
      const styleCode = `import '${getRelativePath(globalScssPath, outputPagePath)}'`;
      const styleAst = babelParse(styleCode, babelConfig);
      p.insertAfter(styleAst);
    }
  } else {
    try {
      absoluteImportPath = pathResolve.sync(value, { basedir: root });
    } catch (err) {
      logger.warn(err.message);
    }
  }
  // combine importName
  const mapKey = specifiers.reduce((result = [], specifier) => {
    const { local } = specifier;
    const { name } = local;
    if (name) {
      if (t.isImportDefaultSpecifier(specifier)) {
        result.push(name);
      } else if (t.isImportSpecifier(specifier)) {
        if (Array.isArray(result[0])) {
          result[0].push(name);
        } else {
          result.unshift([name]);
        }
      }
    }
    return result;
  }, []);

  // cach import infomation
  if (mapKey.length) {
    if (isSkeleton(value)) {
      p.remove();
      set.add(mapKey.toString());
      return;
    }
    map.set(mapKey, [p, absoluteImportPath || value]);
  }

  // remove comments
  if (leadingComments && leadingComments.length) {
    node.leadingComments = [];
  }
};

/**
 * parseFromVariableDeclaration
 * @param p
 * @param pagePath
 * @param options
 * @param map
 * @param set
 */
export const parseFromVariableDeclaration = (
  p: NodePath <t.VariableDeclaration>,
  pagePath: string,
  options: IPath,
  map: Map<any[], NodePath<any> | false>,
  set: Set<string>,
): void => {
  const { node } = p;
  const { trailingComments, declarations = [] } = node;
  if (declarations.length === 1) {
    const [ declaration ] = declarations;
    const { init = {}, id = {} } = declaration as any;
    if (!init) {
      return;
    }
    const { callee = {}, arguments: args } = init;
    if (callee && callee.name === 'require') {
      let { value } = args[0];
      const { outputPagePath } = options;
      if (isRelativePath(value)) {
        const foldPath = getFoldPath(pagePath);
        const absoluteImportPath = findTsFileByPath(resolve(foldPath, value));
        value = args[0].value = removeSuffix(getRelativePath(absoluteImportPath, outputPagePath));
      }

      if (id.name) {
        if (isSkeleton(value)) {
          p.remove();
          set.add(id.name);
          return;
        }
        map.set([id.name], p);
      }
    }
  }

  // remove comments
  if (trailingComments && trailingComments.length) {
    node.trailingComments = [];
  }
};

/**
 * setRootShow
 * @param ast
 * @param options
 */
export const setRootShow = (
  ast: IAst,
  options: IPath,
): void => {
  const { child } = ast;
  const { isPage } = options;
  if (isPage && child && child.length) {
    child.forEach((
      ch: IAst,
    ) => {
      const { attr, tag } = ch;
      if (!tag) { return; }
      if (!attr) {
        ch.attr = {};
      }
      ch.attr[ATTR_SHOW] = '';
    });
  }
};
