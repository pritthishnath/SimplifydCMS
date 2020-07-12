import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";

export default function MuiDialog({
  open,
  onClose,
  title,
  actions,
  children,
  onSubmit,
}) {
  return (
    <div>
      <Dialog open={open} onClose={onClose} aria-labelledby='form-dialog-title'>
        <DialogTitle id='form-dialog-title'>{title}</DialogTitle>
        <form onSubmit={onSubmit}>
          <DialogContent>{children}</DialogContent>
          <DialogActions>
            {actions.map((action, index) => (
              <Button
                key={index}
                onClick={action.onClick}
                color='primary'
                type={action.type}>
                {action.label}
              </Button>
            ))}
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
