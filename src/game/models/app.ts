import { ModelConfig } from '@rematch/core';
import { cach } from '../utils';
import { Stage } from '../enum';

const initialState = cach.get('app') || {
  stage: Stage.Create,
};

const appModel: ModelConfig = {
  state: initialState,
  reducers: {
  },
  effects: {
  },
};

export default appModel;
