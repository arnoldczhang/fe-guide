import {
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
  copySync,
  unlinkSync,
  rmdirSync,
  existsSync,
  removeSync,
  mkdirSync,
} from 'fs-extra';
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
 * 递归清空目录
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
        cleardir(current, keep);
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
 * 通用获取目录下文件
 * @param filePath
 * @param option
 * @param cach
 */
export const readdir = (
  rootPath: string,
  option?: {
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
  } = option || {};
  cach = cach || [];
  readdirSync(rootPath).forEach((file) => {
    const filePath = join(rootPath, '.', file);
    const result = absolute ? filePath : file;

    if (statSync(filePath).isDirectory()) {
      if (deep) {
        return readdir(filePath, option, cach);
      }
    }

    if (!suffix.length) {
      return cach.push(result);
    }

    const match = suffix.some((suf) => {
      if (suf instanceof RegExp) {
        return suf.test(filePath);
      }

      if (typeof suf === 'string') {
        return filePath.includes(suf);
      }

      return false;
    });

    if (match) {
      cach.push(result);
    }
  });
  return cach;
};

/**
 * 获取目录下特定后缀的文件
 *
 * - resolve.sync不满足这里的要求
 *
 * @param path
 * @param suffix
 */
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

export const remove = (dir: string) => removeSync(dir);

export const exist = (dir: string) => existsSync(dir);

export const mkdir = (dir: string) => {
  try {
    if (!exist(dir)) {
      mkdirSync(dir);
    }
  } catch (e) {}
};
