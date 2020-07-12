import * as actions from "../actions/actionTypes";

const initialState = [];

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case actions.SET_ALERT:
      return [...state, { ...payload, open: true }];
    case actions.REMOVE_ALERT:
      return state.filter((alert) => alert.id !== payload);
    case actions.HIDE_ALERT:
      return state.map((alert) =>
        alert.id === payload ? { ...alert, open: false } : { ...alert }
      );
    default:
      return state;
  }
};
