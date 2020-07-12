import React from "react";
import { connect } from "react-redux";
import { Fab, Button, ButtonGroup } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { AddCircle as AddCircleIcon } from "@material-ui/icons";
import { useForm } from "react-hook-form";

import { TableWithSearch, Dialog } from "../../components";
import UserForm from "./components/UserForm";
import { loadUsers, setAlert } from "../../store/actions";
import { User } from "../../shared/api-requests";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
  },
  fab: {
    margin: theme.spacing(1),
    position: "fixed",
    left: theme.spacing(33),
    bottom: theme.spacing(2),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

const Users = ({ usersList, isLoading, currentUser, loadUsers, setAlert }) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const { handleSubmit, reset, ...restUseForm } = useForm();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  // const editHandler = (data) => (e) => {
  //   setFormValues(data);
  //   handleClickOpen();
  // };

  const deleteHandler = (id) => (e) => {
    User.delete(id).then((res) => {
      loadUsers();
      setAlert(res.data.msg, "info");
    });
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const submitData = (data) => {
    User.create(data)
      .then((res) => {
        loadUsers();
        setAlert(res.data.msg, "info");
        handleClose();
      })
      .catch((err) => setAlert(err.response.data.msg, "error"));
  };

  const columns = [
    {
      label: "Name",
      selector: "name",
    },
    {
      label: "E-Mail",
      selector: "email",
    },
    {
      label: "Role",
      selector: "role",
    },
    {
      label: "Actions",
      cell: (data) => {
        if (data._id !== currentUser._id) {
          return (
            <ButtonGroup size='small' color='primary'>
              {/* <Button onClick={editHandler(data)}>Edit</Button> */}
              <Button onClick={deleteHandler(data._id)}>Remove</Button>
            </ButtonGroup>
          );
        }
        return null;
      },
    },
  ];

  const modalActions = [
    {
      label: "Cancel",
      onClick: handleClose,
    },
    {
      label: "Add",
      type: "submit",
    },
  ];
  return (
    <div className={classes.root}>
      <TableWithSearch
        title='All users'
        rows={usersList}
        columns={columns}
        loadingState={isLoading}
      />
      <Fab
        variant='extended'
        color='primary'
        className={classes.fab}
        onClick={handleClickOpen}>
        <AddCircleIcon className={classes.extendedIcon} />
        New User
      </Fab>
      <Dialog
        open={open}
        onClose={handleClose}
        title='New User'
        onSubmit={handleSubmit((data) => submitData(data))}
        actions={modalActions}>
        <UserForm
          showPassword={showPassword}
          restUseForm={restUseForm}
          handlers={{
            handleClickShowPassword,
            handleMouseDownPassword,
          }}
        />
      </Dialog>
    </div>
  );
};

const mapState = (state) => ({
  usersList: state.users.usersList,
  isLoading: state.users.isLoading,
  currentUser: state.auth.currentUser,
});

export default connect(mapState, { loadUsers, setAlert })(Users);
