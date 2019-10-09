import { Comp } from '../utils/klass';
import { IAst, ICO } from './common';

export type ASTFC = (ast: IAst) => any;

export interface INpmOptions {
  // tagName to be ignored
  ignore?: string[] | string;
  // input root direction
  inputDir?: string;
  // output root direction
  outDir?: string;
  // use wxml/wxss treeshake
  treeshake?: boolean;
  // main package pages
  page?: string[] | string | false;
  // animation automatically add to default-bg
  animation?: string | string[];
  // remove unused components and templates
  deleteUnused?: boolean;
  // add default-bg to element which has only one textnode child
  defaultBg?: boolean;
  // config the global grey
  defaultGrey?: string;
  // fix template wxss and generate a normal wxss;
  tplWxss?: boolean;
  // sub package pages
  subPackage?: IPack[];
}

export interface IPack {
  root: string;
  page: string[];
  independent?: boolean;
}

// react options
export interface IReactProps {
  pageRoot: string;
  page: string[];
}

export interface IPath {
  root: string;
  srcPath?: string;
  protoPath?: string;
  mainPath?: string;
  outputPath?: string;
  outputPagePath?: string;
  mainFilePath?: string;
  pagePath?: string;
  compPath?: string;
  watch?: boolean;
  // used in tpl/comp
  parentComp?: Comp;
  // used in tpl/comp
  parentTpl?: Comp;
  // add default-bg-class when tag node has only one text child
  defaultBg?: boolean;
  // fix errors like `tag`, `id` selectors in template wxss
  tplWxss?: boolean;
  // see INpmOptions `deleteUnused`
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
  // `console.log` info or not
  verbose?: boolean;
  // see INpmOptions `treeshake`
  treeshake?: boolean;
  isPage?: boolean;
  // see INpmOptions `ignore`
  ignoreTags?: string[];
  // sub page root, in order to find the components` dir used in sub page
  subPageRoot?: string;
  // is independent subPage or not
  // see https://developers.weixin.qq.com/miniprogram/dev/framework/subpackages/independent.html
  independent?: boolean;
  // global outputPath
  globalOutputPath?: string;
  // global skeleton.wxss file path
  globalWxssPath?: string;
  // global skeleton.scss file path
  globalScssPath?: string;
  // react src page path
  reactSrcPagePath?: string;
  // react suffix
  reactSuffix?: string;
}

export enum animationStyle {
  shine = 'shine',
  jelly = 'jelly',
}

export interface IUnused {
  template: Map<string, Comp>;
  component: Set<string>;
}
