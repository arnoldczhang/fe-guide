import { createSelector } from 'reselect';
import { stateInterface, appInterface } from '../types';

const appSelector = (state: stateInterface): appInterface => state.app;

export default createSelector(
  appSelector,
  (app: appInterface) => {
    return {
      ...app,
    };
  }
);
