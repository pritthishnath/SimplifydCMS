import { Story } from "../../shared/api-requests";
import * as actions from "./actionTypes";
import { setAlert } from ".";

export const loadStories = () => (dispatch) => {
  dispatch({
    type: actions.STORIES_LOADING_START,
  });
  Story.getAll()
    .then((res) => {
      dispatch({
        type: actions.STORIES_LOADING_SUCCESS,
        payload: {
          drafts: res[0].data,
          publications: res[1].data,
        },
      });
    })
    .catch((error) => {
      dispatch({
        type: actions.STORIES_LOADING_FAILURE,
      });
      dispatch(setAlert(error?.response?.data.msg || "Server Error", "error"));
    });
};
