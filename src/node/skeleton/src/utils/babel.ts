import { BabelFileResult, transformSync, traverse } from '@babel/core';
import { ICO } from '../types';
import Logger from './log';

const logger = Logger.getInstance();

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
  if (typeof input === 'string') {
    try {
      return transformSync(input, {
        ast: true,
        code: false,
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

export {
  traverse,
};
