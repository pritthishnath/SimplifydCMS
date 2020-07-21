import * as actions from "./actionTypes";
import { User } from "../../shared/api-requests";
import { setAlert } from ".";

export const loadUsers = () => (dispatch) => {
  dispatch({
    type: actions.USERS_LOADING_START,
  });
  User.getAll()
    .then((res) => {
      dispatch({
        type: actions.USERS_LOADING_SUCCESS,
        payload: res.data,
      });
    })
    .catch((error) => {
      dispatch({
        type: actions.USERS_LOADING_FAILURE,
      });
      dispatch(setAlert(error?.response?.data.msg || "Server Error", "error"));
    });
};
