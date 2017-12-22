import { createSelector } from 'reselect';

const appSelector = state => state.app;

export default createSelector(
  appSelector,
  app => ({
    ...app,
  }),
);
