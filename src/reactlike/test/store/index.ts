import { createStore } from '../provider';
import count from './count';
import calculate from './calculate';

export default createStore({
  count,
  calculate,
})