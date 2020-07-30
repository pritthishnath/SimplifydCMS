import React from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { makeStyles, fade } from "@material-ui/core/styles";
import {
  CssBaseline,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  Divider,
  Button,
  Chip,
  Box,
} from "@material-ui/core";
import {
  People as PeopleIcon,
  MenuBook as MenuBookIcon,
} from "@material-ui/icons";
import Cookie from "js-cookie";

import { Navigation, Spinner } from "../components";
import { authLogout } from "../store/actions";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
  },
  authUserInfo: {
    // marginLeft: theme.spacing(2),
    flex: 1,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    "& h6": {
      marginRight: theme.spacing(1),
    },
  },
  button: {
    backgroundColor: fade(theme.palette.grey[200], 0.25),
    marginLeft: theme.spacing(2),
    color: theme.palette.common.white,
    "&:hover": {
      backgroundColor: fade(theme.palette.grey[200], 0.35),
    },
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    color: theme.palette.grey[50],
    backgroundColor: theme.palette.grey[900],
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerHeader: {
    justifyContent: "center",
  },
  logo: {
    fontWeight: 200,
    fontFamily: "Montserrat",
  },
  drawerFooter: {
    color: theme.palette.grey[300],
    flex: 1,
    alignItems: "flex-end",
    paddingBottom: theme.spacing(2),
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
  },
}));

const useSidebarStyles = makeStyles((theme) => ({
  list: {
    listStyle: "none",
  },
  listLink: {
    textDecoration: "none",
    color: theme.palette.grey[50],
    transition: "all .5s",
  },
  listItem: {
    margin: "4px 0",
    borderRadius: "4px",
    transition: "all .5s",
    "&:hover": {
      backgroundColor: theme.palette.black,
    },
  },
  active: {
    textDecoration: "none",
    "& $listItem": {
      backgroundColor: theme.palette.grey[800],
    },
  },
  listIcon: {
    color: theme.palette.grey[50],
  },
}));

const links = [
  {
    name: "Users",
    icon: () => <PeopleIcon />,
    url: "/admin/al/users",
  },
  {
    name: "Stories",
    icon: () => <MenuBookIcon />,
    url: "/admin/al/stories",
  },
];

const AdminLayout = ({ isLoading, authLogout, children, currentUser }) => {
  const classes = useStyles();
  const sidebarStyles = useSidebarStyles();
  const user = Cookie.get("user");

  const logOut = () => (event) => {
    authLogout();
  };

  if (!user) return <Redirect to='/login' />;

  if (isLoading || !currentUser) return <Spinner />;

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position='fixed' className={classes.appBar}>
        <Toolbar>
          <Box className={classes.authUserInfo}>
            <Typography variant='h6' noWrap>
              Welcome, {currentUser.name}
            </Typography>
            <Chip label={currentUser.role} size='small' />
          </Box>
          <Button className={classes.button} onClick={logOut()}>
            Log Out
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant='permanent'
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor='left'>
        <div className={classes.toolbar}>
          <Toolbar className={classes.drawerHeader}>
            <Typography variant='h6' className={classes.logo}>
              Simplifyd<strong>CMS</strong>
            </Typography>
          </Toolbar>
        </div>
        <Divider />
        <Navigation links={links} customStyles={sidebarStyles} />
        <Toolbar className={classes.drawerFooter}>
          <Typography variant='body2' align='center'>
            {"Copyright © "}
            Simplifyd CMS {new Date().getFullYear()}
            {"."}
          </Typography>
        </Toolbar>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {children}
      </main>
    </div>
  );
};

const mapState = (state) => ({
  isLoading: state.auth.isLoading,
  isAuth: state.auth.isAuth,
  currentUser: state.auth.currentUser,
});

export default connect(mapState, { authLogout })(AdminLayout);
