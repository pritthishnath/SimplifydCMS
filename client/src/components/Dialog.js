import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";

const MuiDialog = ({ title, actions, children, onSubmit, form, ...props }) => {
  return (
    <Dialog aria-labelledby='form-dialog-title' {...props}>
      <DialogTitle id='form-dialog-title'>{title}</DialogTitle>
      {form ? (
        <form onSubmit={onSubmit}>
          <DialogContent>{children}</DialogContent>
          <DialogActions>
            {actions?.map((action, index) => (
              <Button key={index} color='primary' {...action}>
                {action.label}
              </Button>
            ))}
          </DialogActions>
        </form>
      ) : (
        <React.Fragment>
          <DialogContent>{children}</DialogContent>
          <DialogActions>
            {actions?.map((action, index) => (
              <Button key={index} color='primary' {...action}>
                {action.label}
              </Button>
            ))}
          </DialogActions>
        </React.Fragment>
      )}
    </Dialog>
  );
};

export default MuiDialog;
