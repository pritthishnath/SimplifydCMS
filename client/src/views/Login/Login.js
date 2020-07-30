import React from "react";
import { connect } from "react-redux";
import {
  Button,
  TextField,
  Link,
  Grid,
  Typography,
  FormControl,
  InputAdornment,
  InputLabel,
  IconButton,
  OutlinedInput,
  makeStyles,
} from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";

import { AuthLayout } from "../../layouts";
import { authorize } from "../../store/actions";

const useStyles = makeStyles((theme) => ({
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const initialState = {
  email: "",
  password: "",
};

const Login = ({ authorize }) => {
  const classes = useStyles();

  const [formData, setFormData] = React.useState(initialState);
  const [showPassword, setShowPassword] = React.useState(false);
  const { email, password } = formData;

  const handleChange = (prop) => (event) => {
    setFormData({ ...formData, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = () => (event) => {
    event.preventDefault();
    authorize("login", formData);
  };

  return (
    <AuthLayout>
      <Typography component='h1' variant='h5'>
        Log in
      </Typography>
      <form className={classes.form} noValidate>
        <TextField
          variant='outlined'
          margin='normal'
          fullWidth
          id='email'
          label='Email Address'
          value={email}
          autoComplete='email'
          autoFocus
          onChange={handleChange("email")}
        />
        <FormControl fullWidth variant='outlined' margin='normal'>
          <InputLabel htmlFor='outlined-adornment-password'>
            Password
          </InputLabel>
          <OutlinedInput
            id='outlined-adornment-password'
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={handleChange("password")}
            endAdornment={
              <InputAdornment position='end'>
                <IconButton
                  aria-label='toggle password visibility'
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}>
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
            labelWidth={70}
          />
        </FormControl>
        <Button
          type='submit'
          fullWidth
          variant='contained'
          color='primary'
          className={classes.submit}
          onClick={handleSubmit()}>
          Log In
        </Button>
        <Grid container>
          {/* <Grid item xs>
              <Link href='#' variant='body2'>
                Forgot password?
              </Link>
            </Grid> */}
          <Grid item>
            <Link href='/register' variant='body2'>
              Register here
            </Link>
          </Grid>
        </Grid>
      </form>
    </AuthLayout>
  );
};

export default connect(null, { authorize })(Login);
