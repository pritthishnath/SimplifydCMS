import React from "react";
import { connect } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { blueGrey } from "@material-ui/core/colors";
import Cookie from "js-cookie";

import PrivateRoute from "./hoc/PrivateRoute";
import AdminRoutes from "./routes/Admin";
import { LoginView, RegisterView } from "./views";
import { Alert } from "./components";
import { authLogout } from "./store/actions";

const theme = createMuiTheme({
  typography: {
    fontFamily: "Ubuntu, Roboto, Arial, sans-serif",
  },
  palette: {
    primary: {
      main: "#283593",
      light: "#535da8",
      dark: "#1c2566",
    },
    grey: blueGrey,
  },
});

const App = ({ authLogout }) => {
  const user = Cookie.get("user");
  React.useEffect(() => {
    if (!user) {
      if (localStorage.expirationDate) {
        authLogout();
      }
    }
  }, [user, authLogout]);

  return (
    <ThemeProvider theme={theme}>
      <Alert />
      <Switch>
        <Route exact path='/'>
          Home / Landing Page
        </Route>
        <Route path='/login' component={LoginView} />
        <Route path='/register' component={RegisterView} />
        <PrivateRoute path='/admin' component={AdminRoutes} />
      </Switch>
    </ThemeProvider>
  );
};

export default connect(null, { authLogout })(App);
