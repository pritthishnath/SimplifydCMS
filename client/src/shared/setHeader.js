import axios from "axios";

export const setCSRFToken = (csrfToken) => {
  if (csrfToken) {
    axios.defaults.headers["x-csrf-Token"] = csrfToken;
  } else {
    delete axios.defaults.headers["x-csrf-Token"];
  }
};
