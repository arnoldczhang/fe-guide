import { parseComponent } from "vue-template-compiler";
import {
  AST,
  parse as vueParse,
} from 'vue-eslint-parser';
import * as t from '@babel/types';
import {
  BabelFileResult,
  parse,
  TransformOptions,
  transformSync,
  traverse,
} from '@babel/core';
import { babelConfig } from './const';
import { errorCatch } from './helper';

export const parseVue = errorCatch((
  vueContent: string,
  option = {},
) => {
  const { template, script } = parseComponent(
    vueContent,
    option,
  );

  if (typeof template === 'undefined') {
    return {
      template: '',
      script,
    };
  }

  return {
    template: `<template>${template.content}</template>`,
    script,
  };
});

export const transferVueTemplateToAst = errorCatch((
  template: string,
): AST.VElement | undefined => vueParse(template, {}).templateBody);

export const transferJsToAst = errorCatch((
  script: string,
  config: Partial<TransformOptions>,
) => parse(script, config || babelConfig));

export const traverseVueTemplateAst = errorCatch((
  ast: AST.Node,
  hooks: Partial<AST.Visitor>,
) =>
  AST.traverseNodes(ast, {
    enterNode(this: any, node: AST.Node) {
      const { type } = node;
      (this[type] || AST.getFallbackKeys)(node);
    },
    leaveNode(this: any, node: AST.Node) {
      const { type } = node;
      (this[type] || AST.getFallbackKeys)(node);
    },
    ...hooks || {}
  })
);

export const traverseBabelAst = errorCatch((
  ast: t.AnyTypeAnnotation,
  hooks = {},
) =>
  traverse(ast, {
    ...hooks
  })
);
