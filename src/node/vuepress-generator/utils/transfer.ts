import {
  parseComponent,
  compile,
  SFCBlock,
  SFCParserOptions,
} from 'vue-template-compiler';
import * as less from 'less';
import * as css from 'css';
import {
  AST,
  parse as vueParse,
} from 'vue-eslint-parser';
import * as t from '@babel/types';
import * as ts from 'typescript';
import {
  BabelFileResult,
  parse,
  TransformOptions,
  transformSync,
  traverse,
} from '@babel/core';
import {
  parseSync,
  Module,
} from '@swc/core';
import Visitor from '@swc/core/Visitor';
import {
  TraverseOptions,
} from '@babel/traverse';
import generate from '@babel/generator';
import { babelConfig } from './const';
import {
  errorCatch,
  errorCatchSync,
} from './helper';

/**
 * transferTs2js
 */
export const transferTs2js = errorCatch((input = ''): string => {
  return ts.transpile(input, {
    jsx: ts.JsxEmit.Preserve,
    target: ts.ScriptTarget.ESNext,
    importHelpers: true,
    noEmitHelpers: true,
  });
});

/**
 * parseVue
 */
export const parseVue = errorCatch((
  vueContent: string,
  option: SFCParserOptions,
): {
  template: string;
  script?: SFCBlock;
  styles?: SFCBlock[];
} => {
  const { template, script, styles } = parseComponent(
    vueContent,
    option,
  );

  if (!template) {
    return {
      template: '',
      script,
      styles,
    };
  }
  return {
    template: `<template>${template.content}</template>`,
    script,
    styles,
  };
});

/**
 * transferVueTemplateToAst
 */
export const transferVueTemplateToAst = errorCatch((
  template: string,
): AST.VElement | undefined => vueParse(template, {}).templateBody);

/**
 * transferJsToAst
 */
export const transferJsToAst = errorCatch((
  script: string,
  config?: Partial<TransformOptions>,
): t.Program | t.File | null => parse(script, config || babelConfig));

/**
 * transferJsToSwcAst
 */
export const transferJsToSwcAst = errorCatch((
  script: string,
): Module => parseSync(script));

/**
 * transferLessToCss
 */
export const transferLessToCss = errorCatchSync(async (
  content: string,
  option?: Less.Options,
): Promise<Less.RenderOutput> => less.render(content, option || {}));

/**
 * transferCssToAst
 */
export const transferCssToAst = errorCatch((
  content: string,
): css.Stylesheet => css.parse(content));

/**
 * traverseVueTemplateAst
 */
export const traverseVueTemplateAst = errorCatch((
  ast: AST.Node,
  hooks?: Partial<AST.Visitor>,
): void =>
  AST.traverseNodes(ast, {
    enterNode(
      this: any,
      node: AST.Node,
      parent: AST.Node,
    ) {
      const { type } = node;
      (this[type] || AST.getFallbackKeys)(node, parent);
    },
    leaveNode(
      this: any,
      node: AST.Node,
      parent: AST.Node,
    ) {
      const { type } = node;
      (this[type] || AST.getFallbackKeys)(node, parent);
    },
    ...hooks || {}
  })
);

/**
 * traverseBabelAst
 */
export const traverseBabelAst = errorCatch((
  ast: t.AnyTypeAnnotation,
  hooks?: Partial<TraverseOptions>,
): void =>
  traverse(ast, {
    ...hooks || {}
  })
);

/**
 * traverseSwcAst
 */
export const traverseSwcAst = errorCatch((
  ast: Module,
  AdaptVisitor: typeof Visitor,
): Module =>
  new AdaptVisitor().visitModule(ast)
);

export const babelGenerate = generate;
