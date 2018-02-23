import produce from 'immer';

const PROXY_STATE = Symbol('PROXY_STATE');
const states = [];
const cach = {};
const base = {
  array: [1, 2, 3],
};

const producer = function() {
  // ...
};

const markChanged = (state) => {
  state.modified = true;
  if (state.parent) {
    markChanges(state.parent);
  }
};

const markChanges = () => {
  states.forEach((state) => {
    if (Array.isArray(state.base)) {
      if(!shallowEqual(state.proxy, state.base)) {
        markChanged(state);
      }
    } else if (Object.keys(state.proxy).length !== Object.keys(state.base).length) {
      markChanged(state);
    }
  });
};

const finalize = (proxy) => {
  if (proxy.modified) {
    const state = proxy[PROXY_STATE];
    if (state.finalized) {
      return state.copy;
    }
    state.finalized = true;
    state.copy = shallowCopy(proxy);
    const base = state.base;
    each
  }
};

// shallowCopy
const proxy = Object.assign({}, base);

// createPropertyProxy
Object.keys(base).forEach((key) => {
  Object.defineProperty(proxy, key, cach[key] || {
    configurable: true,
    enumerable: true,
    get() {
        return get(this[PROXY_STATE], key)
    },
    set(value) {
        set(this[PROXY_STATE], key, value)
    }
  });
});

// createState
const state = {
  modified: false,
  hasCopy: false,
  parent: undefined,
  base,
  proxy,
  copy: undefined,
  finished: false,
  finalizing: false,
  finalized: false,
};

// createHiddenProperty
Object.defineProperty(proxy, PROXY_STATE, {
  value: state,
  enumerable: false,
  writable: true
});
states.push(state);

const returnValue = producer.call(proxy, proxy);

states.forEach(state => state.finalizeing = true);

markChanges();

const proxyState = base[PROXY_STATE];

finalize(proxy);


















produce(state, (draft) => {
  console.table(state);
  console.table(draft);
});
