import axios from "axios";

export default (token) => {
  if (token) {
    axios.defaults.headers["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers["Authorization"];
  }
};
