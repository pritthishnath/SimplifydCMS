import React from "react";
import {
  TextField,
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
  InputAdornment,
  IconButton,
  MenuItem,
} from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { Controller } from "react-hook-form";

const validationRules = {
  name: {
    required: "Please enter your name",
    pattern: {
      value: /^[A-Z\s]+$/i,
      message: "Name should only contain letters",
    },
    maxLength: {
      value: 30,
      message: "Maximum 30 characters allowed for name",
    },
  },
  username: {
    required: "Please enter an username",
    pattern: {
      value: /^(?![0-9_]*$)[A-Z0-9_]+$/i,
      message: "Letters with numbers and '_' are allowed",
    },
    maxLength: {
      value: 20,
      message: "Maximum 20 characters allowed for username",
    },
  },
  email: {
    required: "Please enter your e-mail address",
    pattern: {
      value: /^[A-Z0-9._%+-]+@(?:[A-Z0-9-]+\.)+[A-Z]{2,63}$/i,
      message: "Please enter a valid e-mail",
    },
  },
  password: {
    required: "Please enter a password",
    minLength: {
      value: 6,
      message: "Password should be minimum 6 characters",
    },
  },
  role: {
    required: "Please select a role",
  },
};

const UserForm = ({ showPassword, handlers, restUseForm }) => {
  const { register, errors, control } = restUseForm;

  const { handleClickShowPassword, handleMouseDownPassword } = handlers;
  return (
    <React.Fragment>
      <TextField
        autoFocus
        id='name'
        label='Full name'
        type='text'
        fullWidth
        required
        name='name'
        inputRef={register(validationRules.name)}
        error={errors.name ? true : false}
        helperText={errors.name?.message || " "}
        defaultValue=''
      />
      <TextField
        id='username'
        label='Username'
        type='text'
        fullWidth
        required
        name='username'
        inputRef={register(validationRules.username)}
        error={errors.username ? true : false}
        helperText={errors.username?.message || " "}
        defaultValue=''
      />
      <TextField
        id='email'
        label='Email Address'
        type='email'
        fullWidth
        required
        name='email'
        inputRef={register(validationRules.email)}
        error={errors.email ? true : false}
        helperText={errors.email?.message || " "}
        defaultValue=''
      />
      <FormControl required fullWidth error={errors.password ? true : false}>
        <InputLabel htmlFor='standard-adornment-password'>Password</InputLabel>
        <Input
          id='standard-adornment-password'
          type={showPassword ? "text" : "password"}
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
          name='password'
          inputRef={register(validationRules.password)}
          defaultValue=''
        />
        <FormHelperText>{errors.password?.message || " "}</FormHelperText>
      </FormControl>
      <Controller
        name='role'
        defaultValue=''
        control={control}
        render={(props) => (
          <TextField
            id='standard-select-role'
            label='Role'
            select
            fullWidth
            required
            {...props}
            error={errors.role ? true : false}
            helperText={errors.role?.message || " "}>
            <MenuItem value='Admin'>Admin</MenuItem>
            <MenuItem value='Editor'>Editor</MenuItem>
            <MenuItem value='Writer'>Writer</MenuItem>
          </TextField>
        )}
        rules={validationRules.role}
      />
    </React.Fragment>
  );
};

export default UserForm;
