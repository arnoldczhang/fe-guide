import { ModelConfig } from '@rematch/core';
import { StarterInterface } from '../types';
import { cach } from '../utils';

const initialState = cach.get('starter') || {
  step: 0,
};

 const starterModel: ModelConfig = {
  state: initialState,
  reducers: {
    prevStep(state: StarterInterface): StarterInterface {
      return Object.assign({}, state, {
        step: state.step - 1,
      });
    },
    nextStep(state: StarterInterface): StarterInterface {
      return Object.assign({}, state, {
        step: state.step + 1,
      });
    },
  },
  effects: {
  },
};

export default starterModel;
