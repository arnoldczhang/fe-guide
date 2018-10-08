import { ModelConfig } from '@rematch/core';
import { headerInterface } from '../types';
import { cach } from '../utils';

const initialState = cach.get('starter') || {

};

 const headerModel: ModelConfig = {
  state: initialState,
  reducers: {
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

export default headerModel;
