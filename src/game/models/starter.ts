import { ModelConfig } from '@rematch/core';
import { StarterInterface } from '../types';
import { cach } from '../utils';

const initialState = cach.get('starter_props') || {
  step: 0,
};

 const starterModel: ModelConfig = {
  state: initialState,
  reducers: {
    prevStep(state: StarterInterface): StarterInterface {
      const step = state.step - 1;
      return Object.assign({}, state, {
        step,
      });
    },
    nextStep(state: StarterInterface): StarterInterface {
      const step = state.step + 1;
      return Object.assign({}, state, {
        step,
      });
    },
  },
  effects: {
  },
};

export default starterModel;
