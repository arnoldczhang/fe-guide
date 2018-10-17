import { Category } from '../enum';

export interface StateInterface<S = any, SS = S> {
  app: S,
  starter: S,
  combat: S,
};

export interface ErrorInfo {
  componentStack: string;
};

export interface Cach {
  readonly KEY: string;
  readonly get: Function;
  readonly getKey: Function;
  readonly set: Function;
  readonly clear: Function;
};

export interface ErrorState {
  hasError?: boolean;
};

export interface ErrorProps {
  children: React.ReactNode;
  className?: string;
};

export type Readonly<T> = {
    readonly [P in keyof T]: T[P];
};

export type Partial<T> = {
    [P in keyof T]?: T[P];
};

export type CF = () => void;

export type CO<T = any> = {
  [key: string]: T;
};

export interface Resource {
  [Category.wood]: number;
  [Category.stone]: number;
  [Category.food]: number;
  [Category.golden]: number;
  [Category.cloth]: number;
};

export interface MartialArt {
  title: string;
  skilled: number;
  introduce?: string;
  traditional: boolean;
  required?: CO<number>; // required base or other attributes
  effects?: CO<number>; // hp or ihp damage
  ratio?: CO<number[]>; // force\subtle\swift ratio
  // more martial infos...
};

export interface MartialArtMap {
  [key: string]: Array<MartialArt>;
};

export interface CombatAttr extends CO {
  [Category.hp]: number;
  [Category.ihp]: number;
  [Category.defence]: number;
  [Category.idefence]: number;
  [Category.force]: number;
  [Category.subtle]: number;
  [Category.swift]: number;
  [Category.tackle]: number;
  [Category.unload]: number;
  [Category.miss]: number;
  [Category.attackRatio]: number;
  [Category.iattackRatio]: number;
  [Category.defenceRatio]: number;
  [Category.idefenceRatio]: number;
};

export interface BaseAttr extends CO {
  [Category.strength]: number;
  [Category.agile]: number;
  [Category.physique]: number;
  [Category.inner]: number;
  [Category.speed]: number;
  [Category.charm]: number;
  [Category.understanding]: number;
};

export interface MartialAttr extends CO {
  [Category.sword]: number[];
  [Category.blade]: number[];
  [Category.fist]: number[];
  [Category.pike]: number[];
  [Category.internal]: number[];
  [Category.lightfoot]: number[];
  [Category.special]: number[];
};

export interface OtherAttr extends CO {
  [Category.doctor]: number[];
  [Category.poison]: number[];
  [Category.carpenter]: number[];
  [Category.blacksmith]: number[];
  [Category.tao]: number[];
  [Category.woven]: number[];
  [Category.craft]: number[];
  [Category.identification]: number[];
};

export interface CharacterAttr {
  name?: string;
  age?: number;
  favor?: string;
  hate?: string;
  remain?: number[];
  martials?: MartialArtMap;
  resource?: Resource;
  baseAttribute?: BaseAttr;
  martialAttribute?: MartialAttr;
  otherAttribute?: OtherAttr;
  combatAttribute?: CombatAttr;
};

export interface Weapon {
  title: string;
  icon?: string;
  cost?: number;
  skilled: number;
  noDelay?: boolean;
  times?: number;
  introduce?: string;
  required?: CO<number>; // required base or other attributes
  effects?: CO<number>; // hp or ihp damage
  ratio?: CO<number[]>;
}
