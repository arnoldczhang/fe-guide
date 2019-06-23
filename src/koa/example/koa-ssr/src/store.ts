import { createStore, combineReducers, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import { fetchCircuits } from "./api";
import { CO } from './types';

export const initializeSession = ( ) => ( {
    type: "INITIALIZE_SESSION",
} );

const storeData = (data: CO ) => ({
    type: "STORE_DATA",
    data,
});

export const fetchData = ( ) => ( dispatch: Function ) =>
    fetchCircuits( ).then((res: CO) => dispatch(storeData(res)));

const sessionReducer = ( state = false, action: CO ) => {
    switch ( action.type ) {
        case "INITIALIZE_SESSION":
            return true;
        default: return state;
    }
};

const dataReducer = ( state: CO = [ ], action: CO ) => {
    switch ( action.type ) {
        case "STORE_DATA":
            return action.data;
        default: return state;
    }
};

const reducer = combineReducers( {
    loggedIn: sessionReducer,
    data: dataReducer,
} );

const create = ( initialState?: CO ) =>
createStore( reducer, initialState, applyMiddleware( thunkMiddleware ) );

export default create;
