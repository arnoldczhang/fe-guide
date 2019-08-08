import * as glob from 'glob';
import { isArr } from './assert';

/**
 * getPageWxml
 * @param path
 * @param reg
 */
export const getPageWxml = (
  path: string,
  reg?: string | string[] | RegExp,
): string[] => {
  reg = reg || /pages\/([^\/]+)\/\1\.wxml$/;
  if (isArr(reg)) {
    reg = reg.map((r: string) => /.wxml$/.test(r) ? r : `${r.replace(/\.[^\.\\\/]+$/, '')}.wxml`);
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
 * @param src
 * @param dest
 */
export const getRelativePath = (src: string, dest: string) => {
  const fileName = getFileName(src);
  const srcArr: string[] = getSplitDir(src);
  const destArr: string[] = getSplitDir(dest);
  const srcLen = srcArr.length;
  const destLen = destArr.length;
  let index = 0;
  const lenCount = Math.min(srcLen, destLen);

  while (index < lenCount) {
    if (srcArr[index] !== destArr[index]) {
      break;
    }
    index++;
  }
  // Fix: duplicate `/` in output path
  const finalTag = index === lenCount ? '' : '/';
  const pathSize = destLen - index;
  const relativeDot = pathSize ? Array(pathSize).fill('..').join('/') : '.';
  return `${relativeDot}/${srcArr.slice(index).join('/')}${finalTag}${fileName}`;
};

export const identity = (v: any): any => v;

export const getFileName = (path: string): string => getDir(path, /.*\/([^\/]+)$/, '$1');

export const getSplitDir = (path: string): string[] => getDir(path).split('/').filter(identity);

export const modifySuffix = (file: string, suffix: string): string => file.replace(/(\.)[^\.]+$/, `$1${suffix}`);

export const addSuffix = (file: string, suffix: string): string => `${file}.${suffix}`;
