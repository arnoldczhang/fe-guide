import { IAst, ICO } from './common';

export type ASTFC = (ast: IAst) => any;

export interface IPath {
  root: string;
  srcPath?: string;
  protoPath?: string;
  mainPath?: string;
  outputPath?: string;
  mainFilePath?: string;
  pagePath?: string;
  compPath?: string;
  wxmlKlassInfo?: ICO;
  verbose?: boolean;
  ignoreTags?: string[];
}
