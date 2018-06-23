import { VNode } from '../src/interface';

export const storeKey = 'store';

export interface ProviderProps {
  [storeKey]: Object;
  children?: Array<VNode>|VNode|null;
}

export interface StoreProps extends Object {
  subscribe?: Function|null;
  dispatch?: Object|null;
  getState?: Function|null;
}