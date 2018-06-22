import { VNode } from '../src/interface';

export const storeKey = 'store';

export interface ProviderProps {
  [storeKey]: Object;
  children?: Array<VNode>|VNode|null;
}

export interface StoreProps {
  subscribe?: Function|null;
  dispatch?: Function|null;
  getState?: Function|null;
}