import React from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import { List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";

const Navigation = ({ links, customStyles }) => {
  const data = links.map((link, index) => {
    return (
      <NavLink
        key={index}
        to={`${link.url}`}
        className={customStyles.listLink}
        activeClassName={customStyles.active}>
        <ListItem button className={customStyles.listItem}>
          <ListItemIcon className={customStyles.listIcon}>
            {link.icon()}
          </ListItemIcon>
          <ListItemText primary={link.name} />
        </ListItem>
      </NavLink>
    );
  });
  return (
    <List className={customStyles.list} component='nav'>
      {data}
    </List>
  );
};

export default Navigation;

Navigation.propTypes = {
  links: PropTypes.arrayOf(PropTypes.object),
  customStyles: PropTypes.object,
};

// activeClassName={customStyles.active}
