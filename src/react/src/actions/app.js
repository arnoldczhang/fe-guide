import { createAction } from 'redux-actions';

export const INIT_APP = 'INIT_APP';

const initApp = createAction(INIT_APP);

export const actionInitApp = (dispatch, payload) => {
  dispatch(initApp(payload));
};
