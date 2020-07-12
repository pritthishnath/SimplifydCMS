import React from "react";
import { connect } from "react-redux";
import { Route, Switch, Redirect } from "react-router-dom";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { blueGrey } from "@material-ui/core/colors";

import Admin from "./routes/Admin";
import { LoginView, RegisterView } from "./views";
import { Alert } from "./components";
import { loadUser } from "./store/actions";

const theme = createMuiTheme({
  typography: {
    fontFamily: "Ubuntu, Roboto, Arial, sans-serif",
  },
  palette: {
    primary: {
      main: "#1a237e",
      light: "#474f97",
      dark: "#121858",
    },
    grey: blueGrey,
  },
});

const App = ({ isAuth, loadUser }) => {
  React.useEffect(() => {
    if (localStorage.jwt_token) {
      loadUser();
    }
  }, [loadUser]);

  return (
    <ThemeProvider theme={theme}>
      <Alert />
      <Switch>
        <Route exact path='/'>
          Home / Landing Page
        </Route>
        <Route path='/login' component={LoginView} />
        <Route path='/register' component={RegisterView} />
        {isAuth ? (
          <Route path='/admin' component={Admin} />
        ) : (
          <Redirect to='/login' />
        )}
      </Switch>
    </ThemeProvider>
  );
};

const mapState = (state) => ({
  isAuth: state.auth.isAuth,
});

export default connect(mapState, { loadUser })(App);
