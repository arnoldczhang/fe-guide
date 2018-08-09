import { createSelector } from 'reselect';

const headerSelector = state => state.header;

export default createSelector(
  headerSelector,
  (header) => {
    return {
      ...header,
    };
});
