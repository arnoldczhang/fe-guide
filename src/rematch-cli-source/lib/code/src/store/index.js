import { init } from '@rematch/core';
import { applyMiddleware } from 'redux';
import * as models from '../models';

const store = init({
  models,
});

export default store;