import { IAst, ICO } from './common';

export type ASTFC = (ast: IAst) => any;

export interface INpmOptions {
  ignore?: string[] | string;
  inputDir?: string;
  outDir?: string;
  treeshake?: boolean;
  page?: string[] | string;
}

export interface IPath {
  root: string;
  srcPath?: string;
  protoPath?: string;
  mainPath?: string;
  outputPath?: string;
  mainFilePath?: string;
  pagePath?: string;
  compPath?: string;
  // cach `id` <-> `class` map
  // replace id with random class
  wxmlKlassInfo?: ICO;
  // cach `class` <-> `ast` map
  // search ast path in treeshaking
  wxmlStructInfo?: ICO;
  // cach key of `usingComponent` used in pages
  usingComponentKeys?: Set<string>;
  // cach key of skeleton files in `usingComponent` used in pages
  skeletonKeys?: Set<string>;
  // cach global style map
  wxssInfo?: Map<string, string>;
  verbose?: boolean;
  treeshake?: boolean;
  isPage?: boolean;
  ignoreTags?: string[];
}
