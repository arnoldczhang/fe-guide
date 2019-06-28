import { IAst } from './common';

export type ASTFC = (ast: IAst) => any;

export interface IPath {
  root: string;
  srcPath?: string;
  mainPath?: string;
  mainFilePath?: string;
  pagePath?: string;
  compPath?: string;
}
