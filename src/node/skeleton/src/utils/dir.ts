import * as glob from 'glob';

export const identity = (v: any): any => v;

export const getPageWxml = (
  path: string,
  reg?: RegExp,
): string[] => {
  reg = reg || /pages\/([^\/]+)\/\1\.wxml$/;
  return glob.sync(path).filter((name) =>
    reg.test(name),
  ) || [];
};

export const getDir = (
  path: string,
  reg?: RegExp,
  replacer?: string,
): string => {
  reg = reg || /\/[^\/]+$/;
  replacer = replacer || '';
  return path.replace(reg, replacer);
};

export const getFileName = (path: string): string => getDir(path, /.*\/([^\/]+)$/, '$1');

export const getSplitDir = (path: string): string[] => getDir(path).split('/').filter(identity);

export const modifySuffix = (file: string, suffix: string): string => file.replace(/(\.)[^\.]+$/, `$1${suffix}`);

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
  return `${Array(destLen - index).fill('..').join('/')}/${srcArr.slice(index).join('/')}/${fileName}`;
};
