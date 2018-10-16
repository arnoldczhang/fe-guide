import { ReactNode } from 'react';
import { Stage } from '../enum';

export interface CombatInterface {
  step: number;
};

export interface CombatState {
};

export interface CombatProps {
  children?: ReactNode;
  dispatch?: Function | any;
  stage?: Stage;
};