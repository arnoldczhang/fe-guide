import { KLASS, PRE, WXSS_BG_GREY } from "../config";
import { IAst, ICO, IPath } from "../types";
import { isArr } from "./assert";
import Logger from './log';
import { replaceColorSymbol, replaceLengthSymbol, trim } from "./reg";

const logger = Logger.getInstance();

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
    result[KLASS] = [...klass, newKlassName];
    ast.attr[KLASS] = result[KLASS];
  } else {
    logger.warn(`<${tag} />设置的${name}不可为空`);
  }
};

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

export const triggerBgAction = (
  ast: IAst,
  options: IPath,
  result: ICO,
  value: string,
  klass: string[],
): void => {
  const { wxssInfo } = options;
  value = isArr(value) ? value.join('') : value;
  let newKlassName: string;
  if (value) {
    newKlassName = `${PRE}-bg-${replaceColorSymbol(value)}`;
    wxssInfo.set(newKlassName, ` background: ${value}!important;color: ${value}!important; `);
  }
  result[KLASS] = [...klass, newKlassName || WXSS_BG_GREY];
  ast.attr[KLASS] = result[KLASS];
};
