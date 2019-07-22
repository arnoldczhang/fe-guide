import {
  copyFile,
  copyFileSync,
  ensureFile,
  ensureFileSync,
  existsSync,
  readFile,
  readFileSync,
  rmdir,
  Stats,
  statSync,
  writeFile,
  writeFileSync,
} from 'fs-extra';
import * as rimraf from 'rimraf';
import { CF, ICO } from '../types';
import { isFunc } from './assert';

export const read = (
  file: string,
  options?: { flag?: string; } | { encoding: string; flag?: string; },
  callback?: CF,
): Promise<any> | string | void | Buffer => {
  options = options || { encoding: 'utf-8' };
  if (isFunc(callback)) {
    return readFile(file, options, callback);
  }
  return readFileSync(file, options);
};

export const copy = (
  src: string,
  dest: string,
  flag?: number,
  callback?: CF,
): void => {
  flag = flag || 0;
  if (isFunc(callback)) {
    return copyFile(src, dest, flag, callback);
  }
  return copyFileSync(src, dest, flag);
};

export const write = (
  file: string,
  data: string,
  options?: { flag?: string; } | { encoding: string; flag?: string; },
  callback?: CF,
): void => {
  options = options || { encoding: 'utf-8' };
  if (isFunc(callback)) {
    return writeFile(file, data, options, callback);
  }
  return writeFileSync(file, data, options);
};

export const ensure = (
  file: string,
  callback?: CF,
): void => {
  if (isFunc(callback)) {
    return ensureFile(file, callback);
  }
  return ensureFileSync(file);
};

export const exists = (
  file: string,
  callback?: CF,
): boolean => {
  if (isFunc(callback)) {
    throw new Error('`fs.exists` is already deprecated');
  }
  return existsSync(file);
};

export const state = (path: string): Stats => {
  return statSync(path);
};

export const remove = (
  dir: string,
  options?: rimraf.Options,
  callback?: (error: Error) => void,
): void => {
  if (options && callback) {
    rimraf(dir, options, callback);
  } else {
    rimraf.sync(dir);
  }
};
