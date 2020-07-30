import * as actions from "../actions/actionTypes";
import { setCSRFToken } from "../../shared/setHeader";

const initialState = {
  csrfToken: "",
  currentUser: null,
  error: "",
  isLoading: false,
};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case actions.AUTH_USER_LOADED:
      setCSRFToken(payload.csrfToken);
      return {
        ...state,
        currentUser: payload.user,
        csrfToken: payload.csrfToken,
        isLoading: false,
      };
    case actions.AUTH_START:
      return {
        ...state,
        isLoading: true,
      };
    case actions.AUTH_SUCCESS:
      return {
        ...state,
        isLoading: false,
      };
    case actions.AUTH_FAILURE:
      return {
        ...state,
        csrfToken: null,
        isLoading: false,
      };
    case actions.AUTH_LOGOUT:
      setCSRFToken(null);
      return {
        ...state,
        csrfToken: null,
        currentUser: null,
        error: null,
      };
    default:
      return state;
  }
};
