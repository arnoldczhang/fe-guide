// import { createSelector } from 'reselect';
import createSelector from './createSelector';

const countSelector = state => state.count;
const calculateSelector = state => state.calculate;

export default createSelector(
  countSelector,
  calculateSelector,
  (count, calculate) => ({
    ...count,
    ...calculate,
  }),
);