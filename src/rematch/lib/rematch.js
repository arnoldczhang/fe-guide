import {
  is,
  expect,
  getCurrentPage,
} from './rematch-helper';

const {
  keys,
} = Object;

// store.dispatch
export let dispatch = () => {};
// store.getState
export let getState = () => {};
// store.subscribe
export let subscribe = () => {};

const initStore = (store) => {
  dispatch = store.dispatch;
  getState = store.getState;
  subscribe = store.subscribe;
};

const traverseGenerator = (
  generator,
  resolve,
  nextInput
) => {
  const { value, done } = is.void0(nextInput)
    ? generator.next()
    : generator.next(nextInput);

  if (done) {
    resolve(value || nextInput);
  } else if (is.promise(value)) {
    value.then(
      res => traverseGenerator(generator, resolve, res),
      err => generator.throw(err)
    );
  } else {
    traverseGenerator(generator, resolve);
  }
};

const checkAndExtendsStore = (
  target,
  targetName,
  checkFn = is.func
) => {
  if (target) {
    expect(target, checkFn, `${targetName}必须是一个方法`);
    target = target({
      dispatch,
      getState,
    });
  }
  return target;
};

const transferModelToAction = (model, key) => {
  if (!is.object(model)) {
    return;
  }
  const { state = {}, reducers = {} } = model;
  dispatch[key] = {};
  const finalReducer = dispatch[key];
  let { effects, sagas } = model;

  effects = checkAndExtendsStore(effects, 'effects');
  sagas = checkAndExtendsStore(sagas, 'sagas');

  keys(reducers).forEach((rKey) => {
    finalReducer[rKey] = function rematchAction(payload, ...args) {
      dispatch({ type: [key, rKey], payload, ...args });
    };
  });

  keys(effects || {}).forEach((eKey) => {
    finalReducer[eKey] = async function rematchEffectsAction(...args) {
      expect(effects[eKey], is.func, `effects字段中的 ${eKey} 必须是一个方法`);
      await effects[eKey].apply(getCurrentPage(), args.concat(state));
    };
  });

  keys(sagas || {}).forEach((sKey) => {
    finalReducer[sKey] = function rematchSagasAction(...args) {
      expect(sagas[sKey], is.func, `sagas字段中的 ${sKey} 必须是一个方法`);
      const generator = sagas[sKey].apply(getCurrentPage(), args.concat(state));
      expect(generator.next, is.func, 'sagas里的调用方式必须是Generator形式');
      return new Promise(resolve => traverseGenerator(generator, resolve));
    };
  });
};

const initModel = (models) => {
  const modelKeys = keys(models);
  modelKeys.forEach((key) => {
    const model = models[key];
    transferModelToAction(model, key);
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
      const [reducerKey, actionKey] = type;
      const actionFound = key === reducerKey && actionKey in reducers;

      if (actionFound) {
        const nextState = reducers[actionKey].call(getCurrentPage(), state, payload);
        const isNullOrPromise = !nextState || is.promise(nextState);
        return isNullOrPromise ? state : nextState;
      }
    }
    return state;
  };
};

export const combineModels = (models) => {
  const reducers = {};
  const modelKeys = keys(models);
  modelKeys.forEach((key) => {
    const model = models[key];
    transferModelToReducer(model, key, reducers);
  });
  return reducers;
};

export const init = (store, config = {}) => {
  const { models } = config;
  initStore(store);
  initModel(models);
  return store;
};
