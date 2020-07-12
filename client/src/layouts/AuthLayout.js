import React from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Spinner } from "../components";

function Copyright() {
  return (
    <Typography variant='body2' color='textSecondary' align='center'>
      {"Copyright © "}
      Simplifyd CMS {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
}));

const AuthLayout = ({ children, isLoading, isAuth }) => {
  const classes = useStyles();

  if (isLoading) return <Spinner />;
  if (isAuth) return <Redirect to='/admin/users' />;

  return (
    <Container component='main' maxWidth='xs'>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        {children}
      </div>
      <Box mt={4}>
        <Copyright />
      </Box>
    </Container>
  );
};

const mapState = (state) => ({
  isLoading: state.auth.isLoading,
  isAuth: state.auth.isAuth,
});

export default connect(mapState)(AuthLayout);
