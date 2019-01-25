export default {
  state: {
    numm: 1,
  },
  reducers: {
    increment(state, payload) {
      state.numm += payload;
      return Object.assign({}, state);
    },
    incrementSuccess(state, payload) {
      console.log(`success ${payload}`);
      return state;
    },
    incrementSagaSuccess(...args) {
      console.log('success all');
      return this.increment(...args);
    },
    incrementSagaFail(state, payload) {
      console.log('fail');
      return state;
    },
  },
  effects: dispatch => ({
    incrementAsync(payload) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          dispatch.count.incrementSuccess(1);
          resolve(payload + 1000);
        }, 3000);
      });
    },
  }),
  sagas: dispatch => ({
    * incrementSaga(payload) {
      try {
        let res = yield this.incrementAsync(payload);
        res = yield this.incrementAsync(res);
        yield dispatch.count.incrementSagaSuccess(res);
      } catch(err) {
        yield dispatch.count.incrementSagaFail(err);
      }
    },
  }),
}
