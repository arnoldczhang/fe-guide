import { Comp } from '../utils/klass';
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
  watch?: boolean;
  parentComp?: Comp;
  parentTpl?: Comp;
  deleteUnused?: boolean;
  // cach componet dest path
  wxComponentInfo?: Set<string>;
  // cach `id` <-> `class` map
  // replace id with random class
  wxmlKlassInfo?: ICO;
  // cach `class` <-> `ast` map
  // search ast path in treeshaking
  wxmlStructInfo?: ICO;
  // cach key of `usingComponent` used in pages
  usingComponentKeys?: Map<string, Comp>;
  // cach template info used in pages
  wxTemplateInfo?: Map<string, Comp>;
  // cach template used in current page
  usingTemplateKeys?: Map<string, string[]>;
  // cach key of skeleton files in `usingComponent` used in pages
  skeletonKeys?: Set<string>;
  // cach global style map
  wxssInfo?: Map<string, string>;
  verbose?: boolean;
  treeshake?: boolean;
  isPage?: boolean;
  ignoreTags?: string[];
}

export enum animationStyle {
  shine = 'shine',
  jelly = 'jelly',
}

export interface IUnused {
  template: Map<string, Comp>;
  component: Set<string>;
}
