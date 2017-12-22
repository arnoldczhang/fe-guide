import {
  INIT_APP,
} from '../actions';

const initialState = {
  inited: 0,
};

export default (state = initialState, action = {}) => {
  const {
    type,
    payload,
  } = action;

  switch (type) {
    case INIT_APP: {
      return Object.assign({}, state, {
        inited: payload || Math.random(),
      });
    }
    default:
      return state;
  }
};
