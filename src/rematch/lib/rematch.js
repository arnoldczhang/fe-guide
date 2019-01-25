import { is, expect } from './rematch-helper';
const {
  keys,
} = Object;
const initDispatch = (store) => {
  dispatch = store.dispatch;
};

const initModel = (models) => {
  const modelKeys = keys(models);
  modelKeys.forEach((key) => {
    const model = models[key];
    transferModelToAction(model, key);
  });
};

const iterateNext = (gen, lastResult) => {
  let { value, done } = is.void0(lastResult) ? gen.next() : gen.next(lastResult);
  if (done) {
    return;
  }

  if (is.promise(value)) {
    value.then(
      res => iterateNext(gen, res),
      err => gen.throw(err),
    );
  } else {
    iterateNext(gen);
  }
};

const transferModelToAction = (model, key) => {
  if (!is.object(model)) {
    return;
  }

  const { state = {}, reducers = {} } = model;
  const finalReducer = dispatch[key] = {};
  let { effects, sagas } = model;

  expect(effects, is.func, 'effects必须是一个方法')
  effects = effects(dispatch);

  expect(sagas, is.func, 'sagas必须是一个方法')
  sagas = sagas(dispatch);

  keys(reducers).forEach((rKey) => {
    finalReducer[rKey] = function rematchAction(payload, ...args) {
      dispatch({ type: [ key, rKey ], payload, ...args });
    };
  });

  keys(sagas).forEach((sKey) => {
    finalReducer[sKey] = async function rematchSagasAction(payload, ...args) {
      const generator = sagas[sKey].call(effects, payload, ...args);
      expect(generator.next, is.func, 'sagas里的调用方式必须是Generator形式');
      iterateNext(generator);
    };
  });
};

export const transferModelToReducer = (model, key, parent = {}) => {
  if (!is.object(model)) {
    return;
  }

  const { state: initialState = {}, reducers = {} } = model;
  parent[key] = function rematchReducer(state = initialState, action) {
    const { type, payload } = action;
    if (is.arr(type)) {
      const [ reducerKey, actionKey ] = type;
      const actionFound = key === reducerKey && actionKey in reducers;
      if (actionFound) {
        const nextState = reducers[actionKey](state, payload);
        const isNullOrPromise = !nextState || is.promise(nextState);
        return isNullOrPromise ? state : nextState;
      }
    }
    return state;
  };
  return parent;
};

export let dispatch = () => {};

export const combineModels = (models) => {
  const result = {};
  const modelKeys = keys(models);
  modelKeys.forEach((key) => {
    const model = models[key];
    transferModelToReducer(model, key, result);
  });
  return result;
};

export const init = (store, config = {}) => {
  const { models } = config;
  initDispatch(store);
  initModel(models);
  return store;
};
