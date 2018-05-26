import { createSelector } from 'reselect';

const countSelector = state => state.count;
const calculateSelector = state => state.calculate;

export default createSelector(
  countSelector,
  calculateSelector,
  (count, calculate) => {
    return {
      ...count,
      ...calculate,
    };
});
