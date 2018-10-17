import { ModelConfig } from '@rematch/core';
import { CombatInterface } from '../types';
import { cach, eq } from '../utils';

const defaultDistance = 6.0;

const minDistance = 2.0;

const maxDistance =9.0;

const initialState = cach.get('combat_props') || {
  asyncDistancePromise: false,
  clickable: true,
  distance: defaultDistance,
  nextDistance: defaultDistance,
  reloadIndex: [-1, -1],
  selectedIndex: [0, 1],
};

const fixDistance: (distance?: number, defaultValue?: number) => number = (distance, defaultValue) => {
  distance = distance || defaultValue || defaultDistance;
  return distance >= minDistance && distance <= maxDistance
    ? distance : Math.min(Math.max(distance, minDistance), maxDistance);
};

const combatModel: ModelConfig = {
  state: initialState,
  reducers: {
    updateReloadIndex(state: CombatInterface, indexArr: number[]): CombatInterface {
      return Object.assign({}, state, {
        reloadIndex: indexArr,
      });
    },
    initDistance(state: CombatInterface): CombatInterface {
      if (defaultDistance !== state.distance) {
        return Object.assign({}, state, {
          distance: defaultDistance,
        });
      }
      return state;
    },
    updateDistance(state: CombatInterface, distance?: number): CombatInterface {
      distance = fixDistance(distance, state.nextDistance);
      if (distance !== state.distance) {
        return Object.assign({}, state, {
          distance,
          nextDistance: distance,
        });
      }
      return state;
    },
    updateNextDistance(state: CombatInterface, step: number): CombatInterface {
      let { nextDistance } = state;
      nextDistance = fixDistance(Number((nextDistance + step).toFixed(1)));
      return Object.assign({}, state, {
        nextDistance,
      });
    },
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
    },
    async updateAsyncDistance(payload?: number): Promise<any> {
      this.updateNextDistance(payload);
      await new Promise<string|void>((resolve) => {
        setTimeout(() => {
          this.updateDistance();
          resolve();
        }, 3000);
      });
    },
  },
};

export default combatModel;
