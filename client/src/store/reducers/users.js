import * as actions from "../actions/actionTypes";

const initialState = {
  usersList: [],
  isLoading: false,
  error: "",
};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case actions.USERS_LOADING_START:
      return {
        ...state,
        isLoading: true,
      };
    case actions.USERS_LOADING_SUCCESS:
      return {
        ...state,
        usersList: payload,
        isLoading: false,
      };
    case actions.USERS_LOADING_FAILURE:
    default:
      return state;
  }
};
