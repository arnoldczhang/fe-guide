"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redux_1 = require("redux");
const redux_thunk_1 = require("redux-thunk");
const api_1 = require("./api");
exports.initializeSession = () => ({
  type: "INITIALIZE_SESSION"
});
const storeData = data => ({
  type: "STORE_DATA",
  data
});
exports.fetchData = () => dispatch =>
  api_1.fetchCircuits().then(res => dispatch(storeData(res)));
const sessionReducer = (state = false, action) => {
  switch (action.type) {
    case "INITIALIZE_SESSION":
      return true;
    default:
      return state;
  }
};
const dataReducer = (state = [], action) => {
  switch (action.type) {
    case "STORE_DATA":
      return action.data;
    default:
      return state;
  }
};
const reducer = redux_1.combineReducers({
  loggedIn: sessionReducer,
  data: dataReducer
});
const create = initialState =>
  redux_1.createStore(
    reducer,
    initialState,
    redux_1.applyMiddleware(redux_thunk_1.default)
  );
exports.default = create;
