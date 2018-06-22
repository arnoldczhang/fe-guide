import { StoreProps } from './provider-props';

const initialState = {};
const initialReducer = {};

const mapState = (target: Object, ...sources: Array<Object|null>): void => {
  sources.forEach((source): void => {
    Object.keys(source).forEach((key): void => {
      target[key] = source[key].state;
    });
  });
};

const mapReducers = (target: Object, ...sources: Array<Object|null>): void => {
  sources.forEach((source): void => {
    Object.keys(source).forEach((key): void => {
      const reducers = source[key].reducers;
      target[key] = target[key] || {};
      Object.keys(reducers).forEach((reducerKey): void => {
        target[key][reducerKey] = reducers[reducerKey];
      });
    });
  });
};

const mapEffects = (target: Object, ...sources: Array<Object|null>): void => {
  sources.forEach((source): void => {
    Object.keys(source).forEach((key): void => {
      const effects = source[key].effects;
      target[key] = target[key] || {};
      Object.keys(effects).forEach((effectKey): void => {
        target[key][effectKey] = effects[effectKey].bind(target);
      });
    });
  });
};

const createStore = (
  state: Object = initialState,
  reducers: Object = initialReducer,
  effects: Object = initialReducer,
): Function => ((data: Object): StoreProps => {
  mapState(state, data);
  mapReducers(reducers, data);
  mapEffects(effects, data);
  return {
    subscribe() {

    },

    dispatch() {

    },

    getState() {
      return state;
    },
  };
});

export default createStore();
