import React from "react";
import { connect } from "react-redux";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

import { hideAlert } from "../store/actions";

function Alert(props) {
  return <MuiAlert elevation={6} variant='filled' {...props} />;
}

const SnackbarAlert = ({ alerts, hideAlert }) => {
  const handleClose = (id) => (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    hideAlert(id);
  };

  return (
    <div>
      {alerts !== null &&
        alerts.length > 0 &&
        alerts.map((alert, i) => {
          return (
            <Snackbar
              key={i}
              open={alert.open}
              autoHideDuration={3500}
              onClose={handleClose(alert.id)}>
              <Alert onClose={handleClose(alert.id)} severity={alert.alertType}>
                {alert.msg}
              </Alert>
            </Snackbar>
          );
        })}
    </div>
  );
};

const mapState = (state) => ({
  alerts: state.alert,
});

export default connect(mapState, { hideAlert })(SnackbarAlert);
