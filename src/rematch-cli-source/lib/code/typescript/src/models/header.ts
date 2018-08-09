
export interface headerInterface {
  name?: string;
}

export default {
  state: {
    name: 'welcome to Rreact',
  },
  reducers: {
    changeTitle(state: headerInterface, payload: string): headerInterface {
      console.log('changing...');
      state.name = payload;
      return Object.assign({}, state);
    },
    changeTitleStart(state: headerInterface): headerInterface {
      console.log('start change...');
      return state;
    },
    changeTitleSuccess(state: headerInterface, payload: string): headerInterface {
      console.log('change success....');
      state.name = payload;
      return Object.assign({}, state);
    },
    changeTitleFail(state: headerInterface): headerInterface {
      console.log('change fail...');
      return state;
    },
  },
  effects: {
    async changeTitleAsync(payload: headerInterface): Promise<any> {
      this.changeTitleStart();
      await new Promise<string|void>((resolve, reject) => {
        setTimeout(() => {
          try {
            this.changeTitleSuccess(payload);
            resolve();
          } catch (err) {
            this.changeTitleFail(payload);
            reject();
          }
        }, 2000);
      });
    },
  },
};
