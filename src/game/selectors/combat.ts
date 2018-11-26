import { createSelector } from 'reselect';
import {
  StateInterface,
  CombatInterface,
  AppInterface,
  CombatProps,
} from '../types';

const appSelector = (state: StateInterface): AppInterface => state.app;
const combatSelector = (state: StateInterface): CombatInterface => state.combat;

export default createSelector(
  appSelector,
  combatSelector,
  (
    app: AppInterface,
    combat: CombatInterface,
  ): CombatProps => {
    return {
      stage: app.stage,
      ...combat,
    };
  }
);
