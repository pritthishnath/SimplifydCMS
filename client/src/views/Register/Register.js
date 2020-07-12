import React from "react";
import { connect } from "react-redux";
import { Button, TextField, Link, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { AuthLayout } from "../../layouts";
import { authorize } from "../../store/actions";
import useValidation from "../../hooks/useValidation";

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(-1),
  },
  paper: {
    marginTop: theme.spacing(3),
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const config = {
  fields: {
    name: {
      isRequired: { message: "Please enter your name" },
      isRegexMatch: {
        regex: /^[A-Z\s]+$/i,
        message: "Name should only contain letters",
      },
      isMaxLength: {
        length: 30,
        message: "Maximum 30 characters allowed for name",
      },
    },
    email: {
      isRequired: { message: "Please enter your e-mail address" },
      isRegexMatch: {
        regex: /^[A-Z0-9._%+-]+@(?:[A-Z0-9-]+\.)+[A-Z]{2,63}$/i,
        message: "Please enter a valid e-mail",
      },
    },
    password: {
      isRequired: { message: "Please enter a password" },
      isMinLength: {
        length: 6,
        message: "Password should be minimum 6 characters",
      },
    },
    username: {
      isRequired: { message: "Please enter an username" },
      isRegexMatch: {
        regex: /^(?![0-9_]*$)[A-Z0-9_]+$/i,
        message: "Letters with numbers and '_' are allowed",
      },
      isMaxLength: {
        length: 20,
        message: "Maximum 20 characters allowed for username",
      },
    },
  },
};

const Register = ({ authorize }) => {
  const classes = useStyles();
  const {
    errors,
    values,
    submitted,
    errorsExist,
    getFieldProps,
  } = useValidation(config);

  // const handleChange = (prop) => (event) => {
  //   setFormData({ ...formData, [prop]: event.target.value });
  // };

  const handleSubmit = () => (event) => {
    event.preventDefault();
    if (errorsExist()) return;
    authorize("register", values);
  };

  return (
    <AuthLayout>
      <Typography component='h1' variant='h5'>
        Register
      </Typography>
      <form className={classes.form} noValidate>
        <TextField
          autoComplete='name'
          variant='outlined'
          required
          fullWidth
          id='name'
          label='Full Name'
          margin='normal'
          autoFocus
          classes={{
            root: classes.root,
          }}
          error={submitted && errors.name ? true : false}
          helperText={(submitted && errors.name) || " "}
          inputProps={getFieldProps("name")}
          // value={name}
          // onChange={handleChange("name")}
        />
        <TextField
          variant='outlined'
          required
          fullWidth
          id='email'
          label='Email Address'
          margin='normal'
          autoComplete='email'
          classes={{
            root: classes.root,
          }}
          error={submitted && errors.email ? true : false}
          helperText={(submitted && errors.email) || " "}
          inputProps={getFieldProps("email")}
          // value={email}
          // onChange={handleChange("email")}
        />
        <TextField
          variant='outlined'
          required
          fullWidth
          label='Password'
          type='password'
          id='password'
          margin='normal'
          autoComplete='current-password'
          classes={{
            root: classes.root,
          }}
          error={submitted && errors.password ? true : false}
          helperText={(submitted && errors.password) || " "}
          inputProps={getFieldProps("password")}
          // value={password}
          // onChange={handleChange("password")}
        />
        <TextField
          variant='outlined'
          required
          fullWidth
          id='username'
          label='Username'
          margin='normal'
          classes={{
            root: classes.root,
          }}
          error={submitted && errors.username ? true : false}
          helperText={(submitted && errors.username) || " "}
          inputProps={getFieldProps("username")}
          // value={groupTitle}
          // onChange={handleChange("groupTitle")}
          // {...getFieldProps("groupTitle")}
        />
        {/* <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox value='allowExtraEmails' color='primary' />}
                label='I want to receive inspiration, marketing promotions and updates via email.'
              />
            </Grid> */}
        <Button
          type='submit'
          fullWidth
          variant='contained'
          color='primary'
          className={classes.submit}
          onClick={handleSubmit()}>
          Register
        </Button>
        <Grid container justify='flex-end'>
          <Grid item>
            <Link href='/login' variant='body2'>
              Already have an account? Sign in
            </Link>
          </Grid>
        </Grid>
      </form>
    </AuthLayout>
  );
};

export default connect(null, { authorize })(Register);
