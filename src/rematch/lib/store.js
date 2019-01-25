const {
  createStore,
  applyMiddleware,
  combineReducers,
} = require('redux');
import * as models from './models';
import { init, combineModels } from './rematch';

const store = createStore(
  reducer: combineReducers(combineModels(models)),
);

module.exports = init(store, { models });
