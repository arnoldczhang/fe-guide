// eslint-disable-next-line no-unused-vars
import * as sourceMap from 'source-map';

const {
  getPrototypeOf,
  prototype: oProto,
} = Object;

const sourceMsgRE = /(?:at\s*[^()]*\s+|[^@]+@|)\(?([^)]+):(\d+):(\d+)\)?/;
const httpRE = /^https?:\/\//;
const localAbsFileRE = /^(?:\/|file:\/\/)/;
const localRelFileRE = /^\.\//;
const mapSuffixRE = /\.map$/;
export const lineRE = /\s*\n+\s*/;

export function identify<T = any>(input: T): T {
  return input;
}

export const parseSourceMsg = (input: string): Array<string>|null => input.match(sourceMsgRE);
export const addMapSuffix = (input: string): string => (mapSuffixRE.test(input) ? input : `${input}.map`);
export const getArg = (
  target: ICO,
  key: string|number,
  defaultValue?: any,
): any => {
  if (key in target) {
    return target[key];
  } if (defaultValue !== undefined) {
    return defaultValue;
  }
  throw new Error(`${key} is a required argument.`);
};
export const isObj = (input: any): boolean => getPrototypeOf(input) === oProto;
export const isStr = (input: any): boolean => typeof input === 'string';
export const isNum = (input: any): boolean => typeof input === 'number' && !Number.isNaN(input);
export const isRe = (input: any): boolean => input instanceof RegExp;
export const isFuc = (input: any): boolean => typeof input === 'function';
export const isSourceMsg = (input: string): boolean => sourceMsgRE.test(input);
export const isHttpFilePath = (input: string): boolean => httpRE.test(input);
export const isAbsFilePath = (input: string): boolean => localAbsFileRE.test(input);
export const isRelFilePath = (input: string): boolean => localRelFileRE.test(input);
export const isSourceMap = (input: sourceMap.RawSourceMap): boolean => input
  && isStr(getArg(input, 'file'))
  && isStr(getArg(input, 'mappings'));
export const showError = (input: string): any => { throw new Error(input); };
export const initOptions = ({
  retryTimes = 0,
  maxTimeout = 3000,
  filter,
}: ISourceOption = {}): ISourceOption => {
  if (!isNum(retryTimes)) {
    return showError('retryTimes格式异常');
  }

  const result: ISourceOption = {
    retryTimes,
    maxTimeout,
  };

  if (filter) {
    if (isFuc(filter)) {
      result.filter = filter;
    } else if (isRe(filter)) {
      result.filter = (input: any): boolean => (filter as RegExp).test(input);
    } else {
      result.filter = (input: any): boolean => filter === input;
    }
  }
  return result;
};

export default {};
