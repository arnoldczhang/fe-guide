import { createSelector } from 'reselect';
import { StateInterface, AppInterface, AppProps } from '../types';

const appSelector = (state: StateInterface): AppInterface => state.app;

export default createSelector(
  appSelector,
  (app: AppInterface): AppProps => {
    return {
      ...app,
    };
  }
);
