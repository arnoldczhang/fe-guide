import {
  CallExpression,
  ExportDefaultDeclaration,
  ImportDeclaration,
} from '@swc/core';
import {
  VueResult,
  PathInfo,
} from '../types';

export function visitCallExpression(
  p: CallExpression,
  result: VueResult,
  pathInfo: PathInfo,
) {
  console.log('todo');
}
export function visitImportDeclaration(
  p: ImportDeclaration,
  result: VueResult,
  pathInfo: PathInfo,
) {
  console.log('todo');
}

export function visitExportDefaultDeclaration(
  p: ExportDefaultDeclaration,
  result: VueResult,
  pathInfo: PathInfo,
) {
  console.log('todo');
}
