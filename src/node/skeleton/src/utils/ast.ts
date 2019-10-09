import { NodePath } from '@babel/traverse';
import * as t from "@babel/types";
import { KLASS_NAME, PRE, WXSS_BG_GREY } from '../config';
import { IPath } from '../types';
import { babelConfig, babelParse, generate, traverse } from './babel';
import Logger from './log';
import { replaceColorSymbol } from './reg';

const logger = Logger.getInstance();

export const parseAstShow = (
  p: NodePath<t.JSXElement>,
  attribute: t.JSXAttribute,
  index: number,
  attributes: Array<t.JSXAttribute | t.JSXSpreadAttribute>,
  options: IPath,
) => {
  const { parentPath, node } = p;
  const { consequent, alternate } = (parentPath as NodePath<any>).node;
  if (parentPath.type === 'ConditionalExpression') {
    parentPath.replaceWith(consequent === node ? consequent : alternate);
  }
  attributes[index] = null;
};

export const parseAstBg = (
  p: NodePath<t.JSXElement>,
  attribute: t.JSXAttribute,
  index: number,
  attributes: t.JSXAttribute[],
  options: IPath,
) => {
  const { wxssInfo } = options;
  const {
    value,
  } = attribute as any;
  let bgKlass = WXSS_BG_GREY;
  if (value) {
    const { value: attrValue } = value;
    bgKlass = `${PRE}-bg-${replaceColorSymbol(String(attrValue))}`;
    wxssInfo.set(bgKlass, ` background: ${attrValue}!important;color: ${attrValue}!important; `);
  }
  let klassAttr = attributes.find((attr: t.JSXAttribute) => (
    attr.name && attr.name.name === KLASS_NAME
  ));

  if (!klassAttr) {
    klassAttr = t.jsxAttribute(
      t.jsxIdentifier(KLASS_NAME),
      t.stringLiteral(bgKlass),
    );
    attributes.push(klassAttr);
  } else if (t.isStringLiteral(klassAttr.value)) {
    klassAttr.value.value += ` ${bgKlass}`;
  } else if (t.isJSXExpressionContainer(klassAttr.value)) {
    const { expression } = klassAttr.value;
    const { quasis } = expression as t.TemplateLiteral;
    if (quasis) {
      quasis[Math.max(quasis.length - 1, 0)].value.raw += ` ${bgKlass}`;
    }
  }
  attributes[index] = null;
};
