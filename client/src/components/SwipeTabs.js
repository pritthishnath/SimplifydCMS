import React from "react";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { AppBar, Tabs, Tab, Paper } from "@material-ui/core";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}>
      {value === index && <Paper>{children}</Paper>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: "100%",
  },
  appBar: {
    boxShadow: "none",
    borderBottom: `1px solid ${theme.palette.grey[100]}`,
  },
}));

const SwipeTabs = ({ tabPanels }) => {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  return (
    <div className={classes.root}>
      <AppBar position='static' color='inherit' className={classes.appBar}>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor='primary'
          textColor='primary'
          //   variant='fullWidth'
          aria-label='full width tabs example'>
          {tabPanels.map((tabPanel, index) => {
            return (
              <Tab
                key={tabPanel.label}
                label={`${tabPanel.label}`}
                {...a11yProps(index)}
              />
            );
          })}
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
        onChangeIndex={handleChangeIndex}>
        {tabPanels.map((tabPanel, index) => {
          return (
            <TabPanel
              key={tabPanel.label}
              value={value}
              index={index}
              dir={theme.direction}>
              {tabPanel.content()}
            </TabPanel>
          );
        })}
      </SwipeableViews>
    </div>
  );
};

export default SwipeTabs;

SwipeTabs.propTypes = {
  tabPanels: PropTypes.arrayOf(PropTypes.object),
};
