import { StoreProps } from './provider-props';

const initialState = {};
const initialReducer = {};
const listeners = [];

const mapState = (target: Object, ...sources: Array<Object|null>): void => {
  sources.forEach((source): void => {
    Object.keys(source).forEach((key): void => {
      target[key] = source[key].state;
    });
  });
};

const mapReducers = (target: Object, state: Object, ...sources: Array<Object|null>): void => {
  sources.forEach((source): void => {
    Object.keys(source).forEach((key): void => {
      const reducers = source[key].reducers;
      const childTarget = target[key] = target[key] || {};
      Object.keys(reducers).forEach((reducerKey): void => {
        childTarget[reducerKey] = function reducerFunc(payload: any): void {
          let hasChanged = false;
          const prevState = state[key];
          const reducer = reducers[reducerKey].bind(childTarget, prevState);
          const nextState = reducer(payload);
          hasChanged = prevState !== nextState;
          // TODO
          if (hasChanged) {
            state[key] = nextState;
            listeners.forEach((listener) => {
              listener();
            });
          }
        };
      });
    });
  });
};

const mapEffects = (target: Object, ...sources: Array<Object|null>): void => {
  sources.forEach((source): void => {
    Object.keys(source).forEach((key): void => {
      const effects = source[key].effects;
      const childTarget = target[key] = target[key] || {};
      Object.keys(effects).forEach((effectKey): void => {
        childTarget[effectKey] = effects[effectKey].bind(childTarget);
      });
    });
  });
};

const mapDispatcher = (dispatcher, ...args) => (<any>Object).assign(dispatcher, ...args);

const createStoreDefault = (
  state: Object = initialState,
  reducers: Object = initialReducer,
  effects: Object = initialReducer,
): Function => ((data: Object): StoreProps => {
    const dispatcher = {};
    mapState(state, data);
    mapReducers(reducers, state, data);
    mapEffects(effects, data);
    mapDispatcher(dispatcher, effects, reducers);
    return {
      dispatch: dispatcher,
      subscribe() {

      },
      getState() {
        return state;
      },
    };
});

export const createStore = createStoreDefault();

export const subscribe = (listener) => {
  listeners.push(listener);
};

