import React from "react";
import { makeStyles, fade } from "@material-ui/core/styles";
import {
  Typography,
  Button,
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Slide,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  button: {
    backgroundColor: fade(theme.palette.grey[200], 0.25),
    marginLeft: theme.spacing(2),
    color: theme.palette.common.white,
    "&:hover": {
      backgroundColor: fade(theme.palette.grey[200], 0.35),
    },
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />;
});

export default function FullScreenDialog({
  open,
  onClose,
  title,
  actions,
  children,
}) {
  const classes = useStyles();

  return (
    <div>
      <Dialog
        fullScreen
        open={open}
        onClose={onClose}
        TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              edge='start'
              color='inherit'
              onClick={onClose}
              aria-label='close'>
              <CloseIcon />
            </IconButton>
            <Typography variant='h6' className={classes.title}>
              {title}
            </Typography>
            {actions.map((action, index) => (
              <Button
                key={index}
                className={classes.button}
                onClick={action.onClick}
                disabled={action.disabled}>
                {action.label}
              </Button>
            ))}
          </Toolbar>
        </AppBar>
        {children}
      </Dialog>
    </div>
  );
}
