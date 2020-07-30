import React from "react";
import { Redirect, Route } from "react-router-dom";
import { connect } from "react-redux";
import Cookie from "js-cookie";

import { authLogout } from "../store/actions";

const PrivateRoute = ({ isLoading, authLogout, ...rest }) => {
  const user = Cookie.get("user");
  React.useEffect(() => {
    if (!user) {
      if (localStorage.expirationDate) {
        authLogout();
      }
    }
  }, [user, authLogout]);
  return (
    <React.Fragment>
      {!user && !isLoading ? <Redirect to='/login' /> : <Route {...rest} />}
    </React.Fragment>
  );
};

const mapState = (state) => ({
  isLoading: state.auth.isLoading,
});

export default connect(mapState, { authLogout })(PrivateRoute);
