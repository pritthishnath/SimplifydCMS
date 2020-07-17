import React from "react";
import PropTypes from "prop-types";
import {
  ClickAwayListener,
  Grow,
  Paper,
  Popper,
  MenuItem,
  MenuList,
  IconButton,
} from "@material-ui/core";
import { MoreVert as MoreVertIcon } from "@material-ui/icons";

const MenuListComposition = ({ menuOptions, data }) => {
  const { buttons, setState } = menuOptions;
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
    setState(data);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <React.Fragment>
      <IconButton
        ref={anchorRef}
        aria-controls='long-menu'
        aria-haspopup='true'
        onClick={handleToggle}>
        <MoreVertIcon />
      </IconButton>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition>
        {({ TransitionProps }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: "top right",
              marginTop: -50,
              marginRight: 40,
            }}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  autoFocusItem={open}
                  id='menu-list-grow'
                  onKeyDown={handleListKeyDown}>
                  {buttons?.map((btn, i) => {
                    if (btn.hidden) return "";
                    return (
                      <MenuItem key={i} onClick={btn.onClick}>
                        {btn.label}
                      </MenuItem>
                    );
                  })}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </React.Fragment>
  );
};

export default MenuListComposition;

MenuListComposition.propTypes = {
  menuOptions: PropTypes.object,
  data: PropTypes.any,
};
