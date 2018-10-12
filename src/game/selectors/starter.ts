import { createSelector } from 'reselect';
import {
  StateInterface,
  StarterInterface,
  AppInterface,
  StarterProps,
} from '../types';

const appSelector = (state: StateInterface): AppInterface => state.app;
const starterSelector = (state: StateInterface): StarterInterface => state.starter;

export default createSelector(
  appSelector,
  starterSelector,
  (
    app: AppInterface,
    starter: StarterInterface,
  ): StarterProps => {
    return {
      stage: app.stage,
      stepIndex: starter.step,
    };
  }
);
