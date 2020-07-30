import * as actions from "./actionTypes";
import { Auth } from "../../shared/api-requests";
import { setAlert } from ".";

export const authStart = () => {
  return {
    type: actions.AUTH_START,
  };
};

export const authLogout = () => (dispatch) => {
  localStorage.removeItem("expirationDate");
  Auth.logout()
    .then(() => {
      dispatch({
        type: actions.AUTH_LOGOUT,
      });
    })
    .catch((err) => {
      dispatch(setAlert(err?.response?.data.msg || "Server Error", "error"));
    });
};

export const checkAuthState = () => (dispatch) => {
  const expirationDate = new Date(localStorage.getItem("expirationDate"));
  if (expirationDate < new Date()) {
    dispatch(authLogout());
  }
};

export const loadUser = () => async (dispatch) => {
  dispatch(authStart());
  dispatch(checkAuthState());
  try {
    const res = await Auth.getCurrentUser();
    dispatch({
      type: actions.AUTH_USER_LOADED,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: actions.AUTH_FAILURE,
    });
    dispatch(setAlert(error?.response?.data.msg || "Server Error", "error"));
  }
};

export const authorize = (type, data) => (dispatch) => {
  dispatch(authStart());
  Auth.authorize(type, data)
    .then((res) => {
      // setExpiration(res.data.expiresIn);
      const expirationDate = new Date(
        new Date().getTime() + res.data.expiresOn * 1000
      );
      localStorage.setItem("expirationDate", expirationDate);
      dispatch({
        type: actions.AUTH_SUCCESS,
      });
      dispatch(loadUser());
    })
    .catch((err) => {
      dispatch({
        type: actions.AUTH_FAILURE,
      });
      dispatch(setAlert(err?.response?.data.msg || "Server Error", "error"));
    });
};
