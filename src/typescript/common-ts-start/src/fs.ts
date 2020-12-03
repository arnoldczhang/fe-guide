import {
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from 'fs-extra';
import {
  isStr,
} from './helper';

/**
 * 
 * @param file 
 */
export const read = (
  file: string,
) => {
  return readFileSync(file, 'utf-8');
};

/**
 * 
 * @param file 
 * @param data 
 */
export const write = (
  file: string,
  data: string,
) => {
  return writeFileSync(file, data, 'utf-8');
};

/**
 * 
 * @param filePath 
 * @param options 
 * @param cach 
 */
export const readdir = (
  filePath: string,
  options?: { deep: boolean; suffix: (string | RegExp)[]},
  cach?: string[],
) => {
  const {
    deep = true,
    suffix = [],
  } = options || {};
  readdirSync(filePath).forEach((file) => {
    if (statSync(file).isDirectory()) {
      if (deep) {
        readdir(file, options, cach);
      }
    } else if (!suffix.length) {
      (cach || (cach = [])).push(file);
    } else {
      const match = suffix.some((suf) => {
        if (suf instanceof RegExp) {
          return suf.test(file);
        }

        if (isStr(suf)) {
          return file.includes(suf);
        }
      });

      if (match) {
        (cach || (cach = [])).push(file);
      }
    }
  });
  return cach;
};
