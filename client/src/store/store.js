import { createStore, applyMiddleware, combineReducers } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import {
  authReducer,
  storiesReducer,
  usersReducer,
  alertReducer,
} from "./reducers";

const initialState = {};

const middleware = [thunk];

const rootReducer = combineReducers({
  auth: authReducer,
  stories: storiesReducer,
  users: usersReducer,
  alert: alertReducer,
});

const store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
