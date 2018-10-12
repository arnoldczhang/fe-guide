import {
  ReactNode,
} from 'react';

import { CF, CO } from './common';
import { Stage, CreateStep, SystemKeyEnum } from '../enum';

export type PersonKeys = 'experience' | 'treasure' | 'feature';
export type SystemKeys = SystemKeyEnum;
export type StartConfig = {
  [K in PersonKeys]: Array<string>|void;
} & {
  [K in SystemKeys]: string;
} & {
  name: string;
  age: number;
};

export interface StarterInterface {
  step: number;
};

export interface StarterState {
  point: number;
  count: number;
  maxPoint: number;
  maxStep: number;
  refreshed: boolean;
  config: StartConfig|any;
  map: Array<Array<AreaInfo>>;
  lastMapOuterIndex: number;
  lastMapInnerIndex: number;
  selectedArea: AreaInfo|null;
};

export interface StarterProps {
  children?: ReactNode;
  dispatch?: Function|any;
  stepIndex: CreateStep;
  stage?: Stage;
};

export interface StepButtonProps {
  prevFunc: CF;
  nextFunc: CF;
  prevWord?: string;
  nextWord?: string;
  finishWord?:string;
  index?: number;
  maxIndex?: number;
};

export interface PersonInfoInterface {
  title: string;
  key: PersonKeys;
  placeholder: string;
  keyArray: Array<string>;
  keyObject: CO;
};

export interface PersonInfoProps {
  count: number;
  max: number;
  result: StartConfig;
  calcCallback: Function;
  list: Array<PersonInfoInterface>;
};

export interface SystemConfigInterface {
  title: string;
  key: SystemKeys;
  keyArray: Array<string>;
  keyObject: CO;
  defaultValue?: string;
}

export interface MartialArt {
  title: string;
  skilled: number;
  introduce?: string;
  traditional: boolean;
  // more martial infos...
}

export interface MartialArtMap {
  [key: string]: Array<MartialArt>;
}

export interface AreaInfo {
  color?: string;
  title?: string;
  key?: string;
  content?: string;
  martial?: MartialArtMap;
  selected?: boolean;
}

export interface SystemProps {
  result: StartConfig;
  list: Array<SystemConfigInterface>;
  selectCallback?: Function;
};

export interface BirthMapProps {
  info: Array<Array<AreaInfo>>;
  clickCallback: Function;
  selectedArea: AreaInfo|null;
};

