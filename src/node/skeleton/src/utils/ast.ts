import { NodePath } from '@babel/traverse';
import * as t from "@babel/types";
import { KLASS_NAME, PRE, WXSS_BG_DARK_GREY, WXSS_BG_GREY, WXSS_BG_LIGHT_GREY } from '../config';
import { ICO, IPath } from '../types';
import { is } from './assert';
import { babelConfig, babelParse, generate, traverse } from './babel';
import Logger from './log';
import { hasDefaultBg, removeDefaultBg, removeStartEndBrace, replaceColorSymbol, replaceLengthSymbol } from './reg';

const logger = Logger.getInstance();

/**
 * parseAstShow
 * @param p
 * @param attribute
 * @param index
 * @param attributes
 * @param options
 */
export const parseAstShow = (
  p: NodePath<t.JSXElement>,
  attribute: t.JSXAttribute,
  index: number,
  attributes: Array<t.JSXAttribute | t.JSXSpreadAttribute>,
  options: IPath,
): void => {
  const { parentPath, node } = p;
  const { consequent, alternate, operator } = (parentPath as NodePath<any>).node;
  if (t.isConditionalExpression(parentPath)) {
    parentPath.replaceWith(consequent === node ? consequent : alternate);
  } else if (t.isLogicalExpression(parentPath)) {
    if (operator === '&&' || operator === '||') {
      parentPath.replaceWith(node as any);
    }
  }
  attributes[index] = null;
};

/**
 * parseAstLightBg
 * @param p
 * @param attribute
 * @param index
 * @param attributes
 * @param options
 */
export const parseAstLightBg = (
  p: NodePath<t.JSXElement>,
  attribute: t.JSXAttribute,
  index: number,
  attributes: t.JSXAttribute[],
  options: IPath,
): void => {
  parseAstBg(p, attribute, index, attributes, options, WXSS_BG_LIGHT_GREY);
};

/**
 * parseAstDarkBg
 * @param p
 * @param attribute
 * @param index
 * @param attributes
 * @param options
 */
export const parseAstDarkBg = (
  p: NodePath<t.JSXElement>,
  attribute: t.JSXAttribute,
  index: number,
  attributes: t.JSXAttribute[],
  options: IPath,
): void => {
  parseAstBg(p, attribute, index, attributes, options, WXSS_BG_DARK_GREY);
};

/**
 * parseAstBg
 * @param p
 * @param attribute
 * @param index
 * @param attributes
 * @param options
 * @param extraKlass
 */
export const parseAstBg = (
  p: NodePath<t.JSXElement>,
  attribute: t.JSXAttribute,
  index: number,
  attributes: t.JSXAttribute[],
  options: IPath,
  extraKlass?: string,
): void => {
  const { wxssInfo } = options;
  const {
    value,
  } = attribute as any;
  let klass = extraKlass || WXSS_BG_GREY;
  if (value) {
    const { value: attrValue } = value;
    klass = `${PRE}-bg-${replaceColorSymbol(String(attrValue))}`;
    wxssInfo.set(klass, ` background: ${attrValue}!important;color: ${attrValue}!important; `);
  }
  parseAstKlass(klass, attributes, index);
};

/**
 * parseAstHeight
 * @param p
 * @param attribute
 * @param index
 * @param attributes
 * @param options
 */
export const parseAstHeight = (
  p: NodePath<t.JSXElement>,
  attribute: t.JSXAttribute,
  index: number,
  attributes: t.JSXAttribute[],
  options: IPath,
): void => (
  parseAstCommon(p, attribute, index, attributes, options, {
    type: 'height',
    midTag: 'ht',
    name: '高度',
    action: replaceLengthSymbol,
  })
);

/**
 * parseAstWidth
 * @param p
 * @param attribute
 * @param index
 * @param attributes
 * @param options
 */
export const parseAstWidth = (
  p: NodePath<t.JSXElement>,
  attribute: t.JSXAttribute,
  index: number,
  attributes: t.JSXAttribute[],
  options: IPath,
): void => (
  parseAstCommon(p, attribute, index, attributes, options, {
    type: 'width',
    midTag: 'wd',
    name: '宽度',
    action: replaceLengthSymbol,
  })
);

/**
 * parseAstPadding
 * @param p
 * @param attribute
 * @param index
 * @param attributes
 * @param options
 */
export const parseAstPadding = (
  p: NodePath<t.JSXElement>,
  attribute: t.JSXAttribute,
  index: number,
  attributes: t.JSXAttribute[],
  options: IPath,
): void => (
  parseAstCommon(p, attribute, index, attributes, options, {
    type: 'padding',
    midTag: 'pd',
    name: '内边距',
    action: replaceLengthSymbol,
  })
);

/**
 * parseAstPaddingTop
 * @param p
 * @param attribute
 * @param index
 * @param attributes
 * @param options
 */
export const parseAstPaddingTop = (
  p: NodePath<t.JSXElement>,
  attribute: t.JSXAttribute,
  index: number,
  attributes: t.JSXAttribute[],
  options: IPath,
): void => (
  parseAstCommon(p, attribute, index, attributes, options, {
    type: 'padding-top',
    midTag: 'pdt',
    name: '上内边距',
    action: replaceLengthSymbol,
  })
);

/**
 * parseAstPaddingRight
 * @param p
 * @param attribute
 * @param index
 * @param attributes
 * @param options
 */
export const parseAstPaddingRight = (
  p: NodePath<t.JSXElement>,
  attribute: t.JSXAttribute,
  index: number,
  attributes: t.JSXAttribute[],
  options: IPath,
): void => (
  parseAstCommon(p, attribute, index, attributes, options, {
    type: 'padding-right',
    midTag: 'pdr',
    name: '右内边距',
    action: replaceLengthSymbol,
  })
);

/**
 * parseAstPaddingBottom
 * @param p
 * @param attribute
 * @param index
 * @param attributes
 * @param options
 */
export const parseAstPaddingBottom = (
  p: NodePath<t.JSXElement>,
  attribute: t.JSXAttribute,
  index: number,
  attributes: t.JSXAttribute[],
  options: IPath,
): void => (
  parseAstCommon(p, attribute, index, attributes, options, {
    type: 'padding-bottom',
    midTag: 'pdb',
    name: '下内边距',
    action: replaceLengthSymbol,
  })
);

/**
 * parseAstPaddingLeft
 * @param p
 * @param attribute
 * @param index
 * @param attributes
 * @param options
 */
export const parseAstPaddingLeft = (
  p: NodePath<t.JSXElement>,
  attribute: t.JSXAttribute,
  index: number,
  attributes: t.JSXAttribute[],
  options: IPath,
): void => (
  parseAstCommon(p, attribute, index, attributes, options, {
    type: 'padding-left',
    midTag: 'pdl',
    name: '左内边距',
    action: replaceLengthSymbol,
  })
);

/**
 * parseAstMargin
 * @param p
 * @param attribute
 * @param index
 * @param attributes
 * @param options
 */
export const parseAstMargin = (
  p: NodePath<t.JSXElement>,
  attribute: t.JSXAttribute,
  index: number,
  attributes: t.JSXAttribute[],
  options: IPath,
): void => (
    parseAstCommon(p, attribute, index, attributes, options, {
      type: 'margin',
      midTag: 'mg',
      name: '外边距',
      action: replaceLengthSymbol,
    })
  );

/**
 * parseAstMarginTop
 * @param p
 * @param attribute
 * @param index
 * @param attributes
 * @param options
 */
export const parseAstMarginTop = (
  p: NodePath<t.JSXElement>,
  attribute: t.JSXAttribute,
  index: number,
  attributes: t.JSXAttribute[],
  options: IPath,
): void => (
  parseAstCommon(p, attribute, index, attributes, options, {
    type: 'margin-top',
    midTag: 'mgt',
    name: '上外边距',
    action: replaceLengthSymbol,
  })
);

/**
 * parseAstMarginRight
 * @param p
 * @param attribute
 * @param index
 * @param attributes
 * @param options
 */
export const parseAstMarginRight = (
  p: NodePath<t.JSXElement>,
  attribute: t.JSXAttribute,
  index: number,
  attributes: t.JSXAttribute[],
  options: IPath,
): void => (
  parseAstCommon(p, attribute, index, attributes, options, {
    type: 'margin-right',
    midTag: 'mgr',
    name: '右外边距',
    action: replaceLengthSymbol,
  })
);

/**
 * parseAstMarginBottom
 * @param p
 * @param attribute
 * @param index
 * @param attributes
 * @param options
 */
export const parseAstMarginBottom = (
  p: NodePath<t.JSXElement>,
  attribute: t.JSXAttribute,
  index: number,
  attributes: t.JSXAttribute[],
  options: IPath,
): void => (
  parseAstCommon(p, attribute, index, attributes, options, {
    type: 'margin-bottom',
    midTag: 'mgb',
    name: '下外边距',
    action: replaceLengthSymbol,
  })
);

/**
 * parseAstMarginLeft
 * @param p
 * @param attribute
 * @param index
 * @param attributes
 * @param options
 */
export const parseAstMarginLeft = (
  p: NodePath<t.JSXElement>,
  attribute: t.JSXAttribute,
  index: number,
  attributes: t.JSXAttribute[],
  options: IPath,
): void => (
  parseAstCommon(p, attribute, index, attributes, options, {
    type: 'margin-left',
    midTag: 'mgl',
    name: '左外边距',
    action: replaceLengthSymbol,
  })
);

/**
 * parseAstCommon
 * @param p
 * @param attribute
 * @param index
 * @param attributes
 * @param options
 * @param payload
 */
export const parseAstCommon = (
  p: NodePath<t.JSXElement>,
  attribute: t.JSXAttribute,
  index: number,
  attributes: t.JSXAttribute[],
  options: IPath,
  payload: ICO,
): void => {
  const {
    node: {
      openingElement,
    },
  } = p;
  const { name: element } = openingElement as any;
  const { wxssInfo } = options;
  const { type, midTag, name, action } = payload;
  const {
    value,
  } = attribute as any;
  if (value) {
    const { value: attrValue } = value;
    const klass = `${PRE}-${midTag}-${action(String(attrValue))}`;
    wxssInfo.set(klass, ` ${type}: ${attrValue}!important;`);
    parseAstKlass(klass, attributes, index);
  } else {
    logger.warn(`<${element.name} />设置的${name}不可为空`);
    attributes[index] = null;
  }
};

/**
 * parseAstKlass
 * @param klass
 * @param attributes
 * @param index
 */
export const parseAstKlass = (
  klass: string,
  attributes: t.JSXAttribute[],
  index?: number,
): void => {
  let klassAttr = attributes.find((attr: t.JSXAttribute): boolean => (
    attr && attr.name && is(attr.name.name, KLASS_NAME)
  ));

  if (!klassAttr) {
    klassAttr = t.jsxAttribute(
      t.jsxIdentifier(KLASS_NAME),
      t.stringLiteral(klass),
    );
    attributes.push(klassAttr);
  } else {
    const klassValue = klassAttr.value;
    if (t.isStringLiteral(klassValue)) {
      klassValue.value += klassValue.value.indexOf(klass) === -1 ? ` ${klass}` : '';
    } else if (t.isJSXExpressionContainer(klassValue)) {
      const { expression = {} } = klassValue;
      // { 'aa' + (condition ? 'bb' : 'cc') }
      // { condition ? 'aa' : 'bb' }
      // {classname}
      if (
        t.isBinaryExpression(expression)
          || t.isConditionalExpression(expression)
          || t.isIdentifier(expression)
      ) {
        let { code } = generate(klassValue as any);
        if (!hasDefaultBg(code)) {
          code = `((${removeStartEndBrace(code)}) + ' ${klass}')`;
          const {
            program: {
              body,
            },
          } = babelParse(code, babelConfig) as any;
          klassValue.expression = body[0].expression;
        }
      // { 'aa ${bb} cc' }
      } else {
        const { quasis } = expression as t.TemplateLiteral;
        if (quasis) {
          const rawValue = quasis.map((quasi) => quasi.value.raw.trim());
          if (!rawValue.includes(klass)) {
            quasis[Math.max(quasis.length - 1, 0)].value.raw += ` ${klass}`;
          }
        }
      }
    }
  }

  if (typeof index !== 'undefined') {
    attributes[index] = null;
  }
};

/**
 * parseAstClear
 * @param p
 * @param attribute
 * @param index
 * @param attributes
 * @param options
 */
export const parseAstClear = (
  p: NodePath<t.JSXElement>,
  attribute: t.JSXAttribute,
  index: number,
  attributes: t.JSXAttribute[],
  options: IPath,
): void => {
  const { node } = p;
  node.children = [];
  attributes[index] = null;
};

/**
 * parseAstRemove
 * @param p
 * @param attribute
 * @param index
 * @param attributes
 * @param options
 */
export const parseAstRemove = (
  p: NodePath<t.JSXElement>,
  attribute: t.JSXAttribute,
  index: number,
  attributes: t.JSXAttribute[],
  options: IPath,
): void => {
  p.remove();
};

/**
 * parseAstRadius
 * @param p
 * @param attribute
 * @param index
 * @param attributes
 * @param options
 */
export const parseAstRadius = (
  p: NodePath<t.JSXElement>,
  attribute: t.JSXAttribute,
  index: number,
  attributes: t.JSXAttribute[],
  options: IPath,
): void => (
  parseAstCommon(p, attribute, index, attributes, options, {
    type: 'border-radius',
    midTag: 'rd',
    name: '圆角',
    action: replaceLengthSymbol,
  })
);

/**
 * parseAstReplace
 * @param p
 * @param attribute
 * @param index
 * @param attributes
 * @param options
 */
export const parseAstReplace = (
  p: NodePath<t.JSXElement>,
  attribute: t.JSXAttribute,
  index: number,
  attributes: t.JSXAttribute[],
  options: IPath,
): void => {
  const {
    node: {
      openingElement,
      closingElement,
    },
  } = p;
  const { name: openingName } = openingElement;
  const { name: closingName } = closingElement;
  const { value: attrValue } = attribute;
  if (attrValue && openingName && closingName) {
    (openingName as t.JSXIdentifier).name = (attrValue as t.StringLiteral).value;
    (closingName as t.JSXIdentifier).name = (attrValue as t.StringLiteral).value;
  }
  attributes[index] = null;
};

/**
 * parseAstFor
 * @param p
 * @param attribute
 * @param index
 * @param attributes
 * @param options
 */
export const parseAstFor = (
  p: NodePath<t.JSXElement>,
  attribute: t.JSXAttribute,
  index: number,
  attributes: t.JSXAttribute[],
  options: IPath,
): void => {
  attributes[index] = null;
  const { value } = attribute as any;
  const { node } = p;
  const inputNum = value.expression ? value.expression.value : value.value;
  const len = Math.max(Number(inputNum - 1), 0) || 0;
  let { parentPath } = p;
  const parentIsCallExpression = parentPath
    && parentPath.parentPath
    && (t.isCallExpression(parentPath = parentPath.parentPath)
      || (t.isBlockStatement(parentPath)
        && parentPath.parentPath
        && parentPath.parentPath.parentPath
        && t.isCallExpression(parentPath = parentPath.parentPath.parentPath)));

  // if like this `sth.map(() => <Element skull-for="3"/>)`
  if (parentIsCallExpression) {
    const { node: parentNode } = parentPath;
    const {
      callee: {
        object = {},
        property = {},
      },
    } = parentNode as any;
    if (is(property.name, 'map')) {
      object.name = `[${new Array(len + 1).fill(0)}]`;
      return;
    }
  }

  // if is plain element, just repeat
  p.insertAfter(new Array(len).fill(node));
};

/**
 * parseAstText
 * @param p
 * @param attribute
 * @param index
 * @param attributes
 * @param options
 */
export const parseAstText = (
  p: NodePath<t.JSXElement>,
  attribute: t.JSXAttribute,
  index: number,
  attributes: t.JSXAttribute[],
  options: IPath,
): void => {
  const klassAttr = attributes.find((attr: t.JSXAttribute): boolean => (
    attr && attr.name && is(attr.name.name, KLASS_NAME)
  ));

  if (klassAttr) {
    if (t.isStringLiteral(klassAttr.value)) {
      klassAttr.value.value = removeDefaultBg(klassAttr.value.value);
    } else if (t.isJSXExpressionContainer(klassAttr.value)) {
      const { expression } = klassAttr.value;
      const { quasis } = expression as t.TemplateLiteral;
      if (quasis) {
        const rawValue = quasis.map((quasi) => quasi.value.raw.trim());
        rawValue.forEach((raw: string, idx: number): void => {
          if (hasDefaultBg(raw)) {
            quasis[idx].value.raw = removeDefaultBg(quasis[idx].value.raw);
          }
        });
      }
    }
  }
  attributes[index] = null;
};
