import { createSelector } from 'reselect';
import { stateInterface, headerInterface } from '../types';

const headerSelector = (state: stateInterface): headerInterface => state.header;

export default createSelector(
  headerSelector,
  (header: headerInterface) => {
    return {
      ...header,
    };
  }
);
