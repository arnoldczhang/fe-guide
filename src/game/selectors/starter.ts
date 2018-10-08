import { createSelector } from 'reselect';
import { stateInterface, starterInterface, appInterface } from '../types';

const appSelector = (state: stateInterface): appInterface => state.app;
const starterSelector = (state: stateInterface): starterInterface => state.starter;

export default createSelector(
  appSelector,
  starterSelector,
  (
    app: appInterface,
    starter: starterInterface,
  ) => {
    return {
      ...app,
      ...starter,
    };
  }
);
