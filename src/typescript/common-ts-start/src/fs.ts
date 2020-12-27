import {
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
  copySync,
  unlinkSync,
  rmdirSync,
  existsSync,
} from 'fs-extra';
import {
  isStr,
} from './helper';
import * as nodePath from 'path';

const {
  join,
} = nodePath;

/**
 *
 * @param file
 */
export const read = (
  file: string,
) => readFileSync(file, 'utf-8');

/**
 *
 * @param file
 */
export const cleardir = (
  rootDir: string,
  keep = true,
) => {
  if (existsSync(rootDir)) {
    const files = readdirSync(rootDir);
    files.forEach((file: string) => {
      const current = join(rootDir, '.', file);
      if (statSync(current).isDirectory()) {
        cleardir(current);
      } else {
        unlinkSync(current);
      }
    });

    if (!keep) {
      rmdirSync(rootDir);
    }
  }
};

/**
 *
 * @param file
 * @param data
 */
export const write = (
  file: string,
  data: string,
) => writeFileSync(file, data, 'utf-8');

/**
 *
 * @param file
 * @param data
 */
export const copy = (
  from: string,
  to: string,
) => copySync(from, to);

/**
 *
 * @param filePath
 * @param options
 * @param cach
 */
export const readdir = (
  rootPath: string,
  options?: {
    deep?: boolean;
    absolute?: boolean;
    suffix?: (string | RegExp)[];
  },
  cach = [] as string[],
) => {
  const {
    absolute = true,
    deep = true,
    suffix = [],
  } = options || {};
  cach = cach || [];
  readdirSync(rootPath).forEach((file) => {
    const filePath = join(rootPath, '.', file);
    const result = absolute ? filePath : file;

    if (statSync(filePath).isDirectory()) {
      if (deep) {
        return readdir(filePath, options, cach);
      }
    }

    if (!suffix.length) {
      return cach.push(result);
    }

    const match = suffix.some((suf) => {
      if (suf instanceof RegExp) {
        return suf.test(filePath);
      }

      if (isStr(suf)) {
        return filePath.includes(suf);
      }
    });

    if (match) {
      cach.push(result);
    }
  });
  return cach;
};

export const getFilePath = (
  path: string,
  suffix = ['js', 'ts', 'vue'],
) => {
  let result = path;
  try {
    if (statSync(path).isDirectory()) {
      suffix.some((suf: string) => {
        result = `${path}/index.${suf}`;
        if (existsSync(result)) {
          return true;
        }
      });
    }
  } catch (err) {
    suffix.some((suf: string) => {
      result = `${path}.${suf}`;
      if (existsSync(result)) {
        return true;
      }
    });
  } finally {
    return result;
  }
};
