import { v4 as uuidv4 } from "uuid";
import * as actions from "./actionTypes";

export const setAlert = (msg, alertType) => (dispatch) => {
  const id = uuidv4();
  dispatch({
    type: actions.SET_ALERT,
    payload: {
      msg,
      alertType,
      id,
    },
  });

  setTimeout(() => {
    dispatch({
      type: actions.REMOVE_ALERT,
      payload: id,
    });
  }, 4500);
};

export const hideAlert = (id) => (dispatch) => {
  dispatch({
    type: actions.HIDE_ALERT,
    payload: id,
  });
};
