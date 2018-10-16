import { ModelConfig } from '@rematch/core';
import { CombatInterface } from '../types';
import { cach, eq } from '../utils';

const initialState = cach.get('combat_props') || {
  clickable: true,
  reloadIndex: [-1, -1],
  selectedIndex: [0, 1],
};

const combatModel: ModelConfig = {
  state: initialState,
  reducers: {
    refreshClickableState(state: CombatInterface): CombatInterface {
      const clickable = !state.clickable;
      return Object.assign({}, state, {
        clickable,
      });
    },
    selectWeapon(state: CombatInterface, indexArr: number[]): CombatInterface {
      const isEqual = eq(indexArr[0], state.selectedIndex[0])
        && eq(indexArr[1], state.selectedIndex[1]);
      
      if (isEqual) {
        return state;
      }
      const reloadIndex = state.selectedIndex;
      const selectedIndex = indexArr;
      return Object.assign({}, state, {
        clickable: false,
        selectedIndex,
        reloadIndex,
      });
    },
  },
  effects: {
    async refreshState(payload: number): Promise<any> {
      await new Promise<string | void>(resolve => {
        setTimeout(() => {
          this.refreshClickableState();
          resolve();
        }, payload * 1000);
      });
    }
  }
};

export default combatModel;
