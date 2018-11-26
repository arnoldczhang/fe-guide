import { ModelConfig } from '@rematch/core';
import { cach, genCharacter, genMap } from '../utils';
import {
  AppInterface,
  StartConfig,
} from '../types';
import { Stage } from '../enum';

const initialState = cach.get('app_props') || {
  stage: Stage.Combat,
  character: {},
  map: [],
};

const appModel: ModelConfig = {
  state: initialState,
  reducers: {
    updateStage(state: AppInterface, stage: Stage): AppInterface {
      return Object.assign({}, state, {
        stage,
      });
    },
    initWorld(state: AppInterface, config: StartConfig): AppInterface {
      const character = genCharacter(config);
      const map = genMap(config);
      return Object.assign({}, state, {
        stage: Stage.Map,
        character,
        map,
      });
    },
  },
  effects: {
  },
};

export default appModel;
