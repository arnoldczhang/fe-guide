import * as glob from 'glob';
import { isArr } from './assert';
import { exists } from './fs';
import { hasSuffix } from './reg';

/**
 * getPageWxml
 * @param path
 * @param reg
 */
export const getPageWxml = (
  path: string,
  reg?: string | string[] | RegExp | false,
  suffix = 'wxml',
): string[] => {
  if (Object.is(reg, false)) {
    return [];
  }
  reg = reg || new RegExp(`pages\\/([^\\/]+)\\/\\1\\.${suffix}$`);
  if (isArr(reg)) {
    reg = reg.map((r: string) => new RegExp(`.${suffix}$`).test(r) ? r : `${r.replace(/\.[^\.\\\/]+$/, '')}.${suffix}`);
    reg = new RegExp(`(?:${reg.join('|')})$`);
  } else if (reg === '*') {
    reg = /[\s\S]*/;
  }
  return glob.sync(path).filter((name: string) =>
    (reg as RegExp).test(name),
  );
};

/**
 * getDir
 * @param path
 * @param reg
 * @param replacer
 */
export const getDir = (
  path: string,
  reg?: RegExp,
  replacer?: string,
): string => {
  reg = reg || /\/[^\/]+$/;
  replacer = replacer || '';
  return path.replace(reg, replacer);
};

/**
 * getRelativePath
 * @param srcPath
 * @param mainPath
 */
export const getRelativePath = (srcPath: string, mainPath: string) => {
  const fileName: string = getFileName(srcPath);
  const srcArr: string[] = getSplitDir(srcPath);
  const destArr: string[] = getSplitDir(mainPath);
  const srcLen: number = srcArr.length;
  const destLen: number = destArr.length;
  let index: number = 0;
  const lenCount: number = Math.min(srcLen, destLen);

  while (index < lenCount) {
    if (srcArr[index] !== destArr[index]) {
      break;
    }
    index++;
  }
  const pathSrc = srcArr.slice(index).join('/');
  // Fix: duplicate `/` in output path
  const finalTag = index === lenCount && !pathSrc ? '' : '/';
  const pathSize = destLen - index;
  const relativeDot = pathSize ? Array(pathSize).fill('..').join('/') : '.';
  return `${relativeDot}/${pathSrc}${finalTag}${fileName}`;
};

export const identity = (v: any): any => v;

export const getFileName = (path: string): string => getDir(path, /.*\/([^\/]+)$/, '$1');

export const getSplitDir = (path: string): string[] => getDir(path).split('/').filter(identity);

export const modifySuffix = (file: string, suffix: string): string => file.replace(/(\.)[^\.]+$/, `$1${suffix}`);

export const addSuffix = (file: string, suffix: string): string => `${file}.${suffix}`;

export const removeSuffix = (file: string): string => file.replace(/(\.)[^\.]+$/, '');

export const getFoldPath = (file: string): string =>
  file.substr(0, file.length - getFileName(file).length);

export const findTsFileByPath = (dir: string): string => {
  if (!hasSuffix(dir)) {
    switch (true) {
      case exists(`${dir}.tsx`):
        dir = `${dir}.tsx`;
        break;
      case exists(`${dir}.ts`):
        dir = `${dir}.ts`;
        break;
      case exists(`${dir}/index.tsx`):
        dir = `${dir}/index.tsx`;
        break;
      default:
        dir = `${dir}/index.ts`;
        break;
    }
  }
  return dir;
};
