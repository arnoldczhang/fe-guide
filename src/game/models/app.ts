import { ModelConfig } from '@rematch/core';
import { appInterface } from '../types';
import { cach } from '../utils';
import { Stage } from '../enum';

const initialState = cach.get('app') || {
  stage: Stage.create,
};

 const appModel: ModelConfig = {
  state: initialState,
  reducers: {
  },
  effects: {
  },
};

export default appModel;
