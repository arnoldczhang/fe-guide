import {
  createStore,
  applyMiddleware,
  combineReducers,
} form 'redux';
import * as models from './models';
import { init, combineModels } from './rematch';

const store = createStore(
  reducer: combineReducers(combineModels(models)),
);

module.exports = init(store, { models });
