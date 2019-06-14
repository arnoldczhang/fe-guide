import { CO } from './types';
export declare const initializeSession: () => {
    type: string;
};
export declare const fetchData: () => (dispatch: Function) => Promise<any>;
declare const create: (initialState?: CO<any>) => import("redux").Store<{
    loggedIn: boolean;
    data: any;
}, import("redux").AnyAction> & {
    dispatch: unknown;
};
export default create;
