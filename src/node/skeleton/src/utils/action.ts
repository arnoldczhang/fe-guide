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
  ATTR_WIDTH,
  KLASS,
  PRE,
  WX_FOR,
  WX_FOR_INDEX,
  WX_FOR_ITEM,
  WX_KEY,
  WXSS_BG_DARK_GREY,
  WXSS_BG_GREY,
  WXSS_BG_LIGHT_GREY,
} from "../config";
import { IAst, ICO, IPath } from "../types";
import { isArr } from "./assert";
import Logger from './log';
import { appendUniq } from "./random";
import { replaceColorSymbol, replaceLengthSymbol, trim } from "./reg";

const logger = Logger.getInstance();

const allAttrs = [
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
  ATTR_WIDTH,
];

const forAttrs = [
  WX_FOR,
  WX_FOR_INDEX,
  WX_FOR_ITEM,
  WX_KEY,
];

/**
 * triggerCustomAction
 * @param ast
 * @param option
 * @param result
 * @param value
 * @param klass
 * @param payload
 */
export const triggerCustomAction = (
  ast: IAst,
  option: IPath,
  result: ICO,
  value: string | string[] | void,
  klass: string[],
  payload: ICO,
): void => {
  const { wxssInfo } = option;
  const { type, midTag, name, action } = payload;
  const { tag } = ast;
  if (value) {
    if (isArr(value)) {
      value = value.join(' ');
    }
    const newKlassName = trim(`${PRE}-${midTag}-${action(value)}`);
    wxssInfo.set(newKlassName, ` ${type}: ${value}!important; `);
    result[KLASS] = appendUniq(klass, newKlassName);
    ast.attr[KLASS] = result[KLASS];
  } else {
    logger.warn(`<${tag} />设置的${name}不可为空`);
  }
};

/**
 * triggerWidthAction
 * @param ast
 * @param options
 * @param result
 * @param value
 * @param klass
 */
export const triggerWidthAction = (
  ast: IAst,
  options: IPath,
  result: ICO,
  value: string,
  klass: string[],
): void => (
  triggerCustomAction(
    ast,
    options,
    result,
    value,
    klass, {
      type: 'width',
      midTag: 'wd',
      name: '宽度',
      action: replaceLengthSymbol,
    })
);

/**
 * triggerHeightAction
 * @param ast
 * @param options
 * @param result
 * @param value
 * @param klass
 */
export const triggerHeightAction = (
  ast: IAst,
  options: IPath,
  result: ICO,
  value: string,
  klass: string[],
): void => (
  triggerCustomAction(
    ast,
    options,
    result,
    value,
    klass, {
      type: 'height',
      midTag: 'ht',
      name: '高度',
      action: replaceLengthSymbol,
    })
);

/**
 * triggerPaddingTopAction
 * @param ast
 * @param options
 * @param result
 * @param value
 * @param klass
 */
export const triggerPaddingTopAction = (
  ast: IAst,
  options: IPath,
  result: ICO,
  value: string,
  klass: string[],
): void => (
  triggerCustomAction(
    ast,
    options,
    result,
    value,
    klass, {
      type: 'padding-top',
      midTag: 'pdt',
      name: '上内边距',
      action: replaceLengthSymbol,
    })
);

/**
 * triggerPaddingRightAction
 * @param ast
 * @param options
 * @param result
 * @param value
 * @param klass
 */
export const triggerPaddingRightAction = (
  ast: IAst,
  options: IPath,
  result: ICO,
  value: string,
  klass: string[],
): void => (
  triggerCustomAction(
    ast,
    options,
    result,
    value,
    klass, {
      type: 'padding-right',
      midTag: 'pdr',
      name: '右内边距',
      action: replaceLengthSymbol,
    })
);

/**
 * triggerPaddingBottomAction
 * @param ast
 * @param options
 * @param result
 * @param value
 * @param klass
 */
export const triggerPaddingBottomAction = (
  ast: IAst,
  options: IPath,
  result: ICO,
  value: string,
  klass: string[],
): void => (
  triggerCustomAction(
    ast,
    options,
    result,
    value,
    klass, {
      type: 'padding-bottom',
      midTag: 'pdb',
      name: '下内边距',
      action: replaceLengthSymbol,
    })
);

/**
 * triggerPaddingLeftAction
 * @param ast
 * @param options
 * @param result
 * @param value
 * @param klass
 */
export const triggerPaddingLeftAction = (
  ast: IAst,
  options: IPath,
  result: ICO,
  value: string,
  klass: string[],
): void => (
  triggerCustomAction(
    ast,
    options,
    result,
    value,
    klass, {
      type: 'padding-left',
      midTag: 'pdl',
      name: '左内边距',
      action: replaceLengthSymbol,
    })
);

/**
 * triggerPaddingAction
 * @param ast
 * @param options
 * @param result
 * @param value
 * @param klass
 */
export const triggerPaddingAction = (
  ast: IAst,
  options: IPath,
  result: ICO,
  value: string,
  klass: string[],
): void => (
  triggerCustomAction(
    ast,
    options,
    result,
    value,
    klass, {
      type: 'padding',
      midTag: 'pd',
      name: '内边距',
      action: replaceLengthSymbol,
    })
);

/**
 * triggerMarginTopAction
 * @param ast
 * @param options
 * @param result
 * @param value
 * @param klass
 */
export const triggerMarginTopAction = (
  ast: IAst,
  options: IPath,
  result: ICO,
  value: string,
  klass: string[],
): void => (
  triggerCustomAction(
    ast,
    options,
    result,
    value,
    klass, {
      type: 'margin-top',
      midTag: 'mgt',
      name: '上外边距',
      action: replaceLengthSymbol,
    })
);

/**
 * triggerMarginRightAction
 * @param ast
 * @param options
 * @param result
 * @param value
 * @param klass
 */
export const triggerMarginRightAction = (
  ast: IAst,
  options: IPath,
  result: ICO,
  value: string,
  klass: string[],
): void => (
  triggerCustomAction(
    ast,
    options,
    result,
    value,
    klass, {
      type: 'margin-right',
      midTag: 'mgr',
      name: '右外边距',
      action: replaceLengthSymbol,
    })
);

/**
 * triggerMarginBottomAction
 * @param ast
 * @param options
 * @param result
 * @param value
 * @param klass
 */
export const triggerMarginBottomAction = (
  ast: IAst,
  options: IPath,
  result: ICO,
  value: string,
  klass: string[],
): void => (
  triggerCustomAction(
    ast,
    options,
    result,
    value,
    klass, {
      type: 'margin-bottom',
      midTag: 'mgb',
      name: '下外边距',
      action: replaceLengthSymbol,
    })
);

/**
 * triggerMarginLeftAction
 * @param ast
 * @param options
 * @param result
 * @param value
 * @param klass
 */
export const triggerMarginLeftAction = (
  ast: IAst,
  options: IPath,
  result: ICO,
  value: string,
  klass: string[],
): void => (
  triggerCustomAction(
    ast,
    options,
    result,
    value,
    klass, {
      type: 'margin-left',
      midTag: 'mgl',
      name: '左外边距',
      action: replaceLengthSymbol,
    })
);

/**
 * triggerMarginAction
 * @param ast
 * @param options
 * @param result
 * @param value
 * @param klass
 */
export const triggerMarginAction = (
  ast: IAst,
  options: IPath,
  result: ICO,
  value: string,
  klass: string[],
): void => (
  triggerCustomAction(
    ast,
    options,
    result,
    value,
    klass, {
      type: 'margin',
      midTag: 'mg',
      name: '外边距',
      action: replaceLengthSymbol,
    })
);

/**
 * triggerBgAction
 * @param ast
 * @param options
 * @param result
 * @param value
 * @param klass
 * @param otherBg
 */
export const triggerBgAction = (
  ast: IAst,
  options: IPath,
  result: ICO,
  value: string,
  klass: string[],
  otherBg?: string,
): void => {
  const { wxssInfo } = options;
  value = isArr(value) ? value.join('') : value;
  let newKlassName: string;
  if (!otherBg && value) {
    newKlassName = `${PRE}-bg-${replaceColorSymbol(value)}`;
    wxssInfo.set(newKlassName, ` background: ${value}!important;color: ${value}!important; `);
  }
  result[KLASS] = appendUniq(klass, otherBg || newKlassName || WXSS_BG_GREY);
  ast.attr[KLASS] = result[KLASS];
};

/**
 * triggerDarkBgAction
 * @param ast
 * @param options
 * @param result
 * @param value
 * @param klass
 */
export const triggerDarkBgAction = (
  ast: IAst,
  options: IPath,
  result: ICO,
  value: string,
  klass: string[],
): void => {
  triggerBgAction(ast, options, result, value, klass, WXSS_BG_DARK_GREY);
};

/**
 * triggerLightBgAction
 * @param ast
 * @param options
 * @param result
 * @param value
 * @param klass
 */
export const triggerLightBgAction = (
  ast: IAst,
  options: IPath,
  result: ICO,
  value: string,
  klass: string[],
): void => {
  triggerBgAction(ast, options, result, value, klass, WXSS_BG_LIGHT_GREY);
};

const replaceAttrs = allAttrs
  .filter((attr: string) => attr !== ATTR_REPLACE)
  .concat(forAttrs);

/**
 * triggerReplaceAction
 * @param ast
 * @param value
 */
export const triggerReplaceAction = (
  ast: IAst,
  value: string,
): ICO => {
  ast.tag = value;
  const { attr } = ast;
  const result: ICO = {};
  Object.keys(attr).forEach((key: string) => {
    if (replaceAttrs.includes(key)) {
      result[key] = attr[key];
    }
  });
  ast.attr = result;
  return result;
};

/**
 * triggerBorderRadiusAction
 * @param ast
 * @param options
 * @param result
 * @param value
 * @param klass
 */
export const triggerBorderRadiusAction = (
  ast: IAst,
  options: IPath,
  result: ICO,
  value: string,
  klass: string[],
): void => (
  triggerCustomAction(
    ast,
    options,
    result,
    value,
    klass, {
      type: 'border-radius',
      midTag: 'rd',
      name: '圆角',
      action: replaceLengthSymbol,
    })
);
