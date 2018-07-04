import { VNode } from '../src/interface';
export declare const storeKey = "store";
export interface ProviderProps {
    children?: Array<VNode> | VNode | null;
}
export interface StoreProps extends Object {
    subscribe?: Function | null;
    dispatch?: Object | null;
    getState?: Function | null;
}
