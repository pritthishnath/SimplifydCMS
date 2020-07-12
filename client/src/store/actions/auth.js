import * as actions from "./actionTypes";
import { User } from "../../shared/api-requests";
import setAuthHeader from "../../shared/setAuthHeader";
import { setAlert } from ".";

export const authStart = () => {
  return {
    type: actions.AUTH_START,
  };
};

export const authLogout = () => {
  localStorage.removeItem("jwt_token");
  localStorage.removeItem("expirationDate");
  setAuthHeader(null);
  return {
    type: actions.AUTH_LOGOUT,
  };
};

export const setAuthTimeout = (expiresIn) => (dispatch) => {
  setTimeout(() => {
    dispatch(authLogout());
  }, expiresIn * 1000);
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
  if (localStorage.jwt_token) {
    setAuthHeader(localStorage.getItem("jwt_token"));
  }
  try {
    const res = await User.getCurrentUser();
    dispatch({
      type: actions.AUTH_USER_LOADED,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: actions.AUTH_FAILURE,
      payload: error.response.data.msg,
    });
  }
};

export const authorize = (type, data) => (dispatch) => {
  dispatch(authStart());
  User.authorize(type, data)
    .then((res) => {
      const expirationDate = new Date(
        new Date().getTime() + res.data.expiresIn * 1000
      );
      localStorage.setItem("jwt_token", res.data.token);
      localStorage.setItem("expirationDate", expirationDate);
      dispatch({
        type: actions.AUTH_SUCCESS,
        payload: res.data,
      });
      dispatch(loadUser());
      dispatch(setAuthTimeout(res.data.expiresIn));
    })
    .catch((err) => {
      dispatch({
        type: actions.AUTH_FAILURE,
      });
      dispatch(setAlert(err.response.data.msg, "error"));
      console.log(err.response.data);
    });
};
