export const count = {
  state: {
    numm: 0,
  },
  reducers: {
    increment(state, payload) {
      state.numm += payload;
      return Object.assign({}, state);
    },
    incrementStart(state) {
      console.log('start');
      return state;
    },
    incrementSuccess(state, payload) {
      console.log('success');
      state.numm += payload;
      return Object.assign({}, state);
    },
    incrementFail(state) {
      console.log('fail');
      return state;
    },
    incrementSaga: function* incrementSaga(state, payload) {
      console.log('startI');
      yield this.incrementStart();
      try {
        console.log('successI');
        yield this.incrementSuccess(payload);
      } catch(err) {
        console.log('failI');
        yield this.incrementFail();
      }
    },
  },
  effects: {
    async incrementAsync(payload, rootState) {
      this.incrementStart();
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            this.incrementSuccess(payload);
            resolve();
          } catch(err) {
            this.incrementFail(payload);
            reject();
          }
        }, 2000);
      });
    },
  },
}