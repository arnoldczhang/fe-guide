import {
  parseComponent,
  compile,
  SFCBlock,
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
  TraverseOptions,
} from '@babel/traverse';
import generate from '@babel/generator';
import { babelConfig } from './const';
import { errorCatch } from './helper';

export const transferTs2js = errorCatch((input = ''): string => {
  return ts.transpile(input, {
    jsx: ts.JsxEmit.Preserve,
    target: ts.ScriptTarget.ESNext,
    importHelpers: true,
    noEmitHelpers: true,
  });
});

export const parseVue = errorCatch((
  vueContent: string,
  option = {},
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

export const getBlockAttrs = (
  attrs: Record<string, string>
): string =>
  Object.keys(attrs).reduce((res: string, pre: string) => {
    res += ` ${pre}="${attrs[pre]}"`;
    return res;
  }, '')
;

export const transferVueTemplateToAst = errorCatch((
  template: string,
): AST.VElement | undefined => vueParse(template, {}).templateBody);

export const transferJsToAst = errorCatch((
  script: string,
  config?: Partial<TransformOptions>,
): t.Program | t.File | null => parse(script, config || babelConfig));

export const transferLessToCss = errorCatch(async (
  content: string,
): Promise<Less.RenderOutput> => less.render(content, {
  plugins: [],
}));

export const transferCssToAst = errorCatch((
  content: string,
): css.Stylesheet => css.parse(content));

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

export const traverseBabelAst = errorCatch((
  ast: t.AnyTypeAnnotation,
  hooks?: Partial<TraverseOptions>,
): void =>
  traverse(ast, {
    ...hooks || {}
  })
);

export const babelGenerate = generate;
