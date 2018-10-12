import { init } from '@rematch/core';
import models from '../models';

const store = init({
  models,
});

export const { dispatch } = store;

export default store;
