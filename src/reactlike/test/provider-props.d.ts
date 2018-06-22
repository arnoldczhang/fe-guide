import { VNode } from '../src/interface';
export declare const storeKey = "store";
export interface ProviderProps {
    children?: Array<VNode> | VNode | null;
}
export interface StoreProps {
    subscribe?: Function | null;
    dispatch?: Function | null;
    getState?: Function | null;
}
