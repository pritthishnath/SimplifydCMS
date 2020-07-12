import * as actions from "../actions/actionTypes";

const initialState = {
  drafts: [],
  publications: [],
  error: "",
  isLoading: false,
};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case actions.STORIES_LOADING_START:
      return {
        ...state,
        isLoading: true,
      };
    case actions.STORIES_LOADING_SUCCESS:
      return {
        ...state,
        drafts: payload.drafts,
        publications: payload.publications,
        isLoading: false,
      };
    case actions.STORIES_LOADING_FAILURE:
    default:
      return state;
  }
};
