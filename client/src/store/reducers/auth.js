import * as actions from "../actions/actionTypes";

const initialState = {
  token: localStorage.getItem("jwt_token"),
  currentUser: null,
  isAuth: false,
  error: "",
  isLoading: false,
};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case actions.AUTH_USER_LOADED:
      return {
        ...state,
        currentUser: payload,
        isAuth: true,
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
        token: payload.token,
        isAuth: true,
        isLoading: false,
      };
    case actions.AUTH_FAILURE:
      return {
        ...state,
        token: null,
        isLoading: false,
        isAuth: false,
      };
    case actions.AUTH_LOGOUT:
      return {
        ...state,
        token: null,
        currentUser: null,
        error: null,
        isAuth: false,
      };
    default:
      return state;
  }
};
