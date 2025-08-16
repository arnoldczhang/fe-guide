function createStore(reducer, initialState = {}) {
  let state = initialState;
  return {
    dispatch(action) {
      // 如果reducer是个对象集合，这里可以做遍历触发
      state = reducer(state, action);
    },
    getState() {
      return state;
    },
  };
};

function testReducer(state, action) {
  const { type, payload } = action;
  switch (type) {
    case 'test':
      state.name = payload.xxx;
      return state;
    default:
      return state;
  }
};

const store = createStore(testReducer);
store.dispatch({
  type: 'test',
  payload: {
    xxx: 'test',
  },
});
