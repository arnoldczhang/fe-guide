import { ReactNode } from 'react';
import { Stage } from '../enum';
import { Weapon } from '../types';

export interface CombatInterface {
  clickable: boolean;
  reloadIndex: number[];
  selectedIndex: number[];
  distance: number;
  nextDistance: number;
};

export interface CombatSceneState {
};

export interface CombatState {
  weaponList: Weapon[][];
};

export interface CombatOperationState {
};

export interface CombatProps {
  children?: ReactNode;
  dispatch?: Function|any;
  stage: Stage;
  clickable: boolean;
  reloadIndex: number[];
  selectedIndex: number[];
  distance: number;
  nextDistance: number;
};

export interface CombatDistanceProps {
  distance: number;
  defaultValue: number;
  addCallback: Function;
  minusCallback: Function;
};

export interface CombatDistanceState {
};