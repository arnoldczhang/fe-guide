import { BabelFileResult, parse, transformSync, traverse } from '@babel/core';
import generate from '@babel/generator';
import * as t from '@babel/types';
import * as ts from 'typescript';
import { IBabelConfig, ICO } from '../types';
import Logger from './log';

const logger = Logger.getInstance();

export const babelConfig: IBabelConfig = {
  presets: [
    ['@babel/env', {
      modules: 'commonjs',
    }],
    "@babel/react",
  ],
  plugins: [
    ['@babel/plugin-transform-runtime', {
      regenerator: true,
    }],
  ],
};

export const toBufferString = (input: Buffer | string) => {
  if (input instanceof Buffer) {
    input = input.toString();
  }

  if ((input as any) instanceof String) {
    input = input.valueOf();
  }
  return input;
};

export const transform = (
  input: Buffer | string,
  options: ICO = {},
): BabelFileResult => {
  input = toBufferString(input);
  const { config } = options;
  if (typeof input === 'string') {
    try {
      return transformSync(input, {
        ast: true,
        code: true,
        babelrc: false,
        configFile: false,
        presets: [
          ['@babel/env', {
            // corejs: 2,
            // debug: true,
            // useBuiltIns: "usage",
          }],
        ],
        plugins: [
          "@babel/plugin-proposal-class-properties",
        ],
      });
    } catch ({ message }) {
      logger.warn(message);
    }
  }
};

export const ts2js = (input = ''): string => {
  let result = '';
  try {
    result = ts.transpile(input, {
      jsx: ts.JsxEmit.Preserve,
      target: ts.ScriptTarget.ESNext,
      importHelpers: true,
      noEmitHelpers: true,
    });
  } catch (err) {
    logger.warn(err);
  }
  return result;
};

export const babelParse = parse;

export {
  traverse,
  generate,
};
