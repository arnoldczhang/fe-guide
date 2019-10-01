import { NodePath } from '@babel/traverse';
import * as t from "@babel/types";
import Logger from './log';

const logger = Logger.getInstance();

export const parseAstShow = (
  p: NodePath<t.JSXElement>,
  attribute: t.JSXAttribute,
  index: number,
  attributes: Array<t.JSXAttribute | t.JSXSpreadAttribute>,
) => {
  const { parentPath, node } = p;
  const { consequent, alternate } = (parentPath as NodePath<any>).node;
  if (parentPath.type === 'ConditionalExpression') {
    parentPath.replaceWith(consequent === node ? consequent : alternate);
    attributes[index] = null;
  }
};
