import React from "react";
import PropTypes from "prop-types";
import { makeStyles, fade } from "@material-ui/core/styles";
import { Paper, Typography, Toolbar, InputBase } from "@material-ui/core";

import { Search as SearchIcon } from "@material-ui/icons";

import { TableWithSorting } from "..";

const useStyles = makeStyles((theme) => ({
  paper: {
    width: "100%",
  },
  // toolbar: {
  //   backgroundColor: theme.palette.primary.dark,
  // },
  table: {
    minWidth: 750,
  },
  loadingCircle: {
    display: "flex",
    justifyContent: "center",
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
  title: {
    flexGrow: 1,
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.grey[200], 0.25),
    "&:hover": {
      backgroundColor: fade(theme.palette.grey[200], 0.35),
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "15ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

const TableWithSearch = ({ title, rows, columns, loadingState }) => {
  const classes = useStyles();
  const [search, setSearch] = React.useState("");
  const [filteredRows, setFilteredRows] = React.useState([]);

  React.useEffect(() => {
    setFilteredRows(
      rows.filter((row) => {
        return columns.some((column) => {
          if (column.selector) {
            if (row[`${column.selector}`])
              return row[`${column.selector}`]
                .toLowerCase()
                .includes(search.toLowerCase());
          }
          return null;
        });
      })
    );
  }, [search, rows, columns]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  return (
    <Paper className={classes.paper}>
      <Toolbar>
        <Typography className={classes.title} variant='h5' noWrap>
          {title}
        </Typography>
        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <SearchIcon />
          </div>
          <InputBase
            value={search}
            placeholder='Search…'
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
            onChange={(e) => handleSearch(e)}
          />
        </div>
      </Toolbar>
      <TableWithSorting
        rows={filteredRows}
        columns={columns}
        loadingState={loadingState}
      />
    </Paper>
  );
};

export default TableWithSearch;

TableWithSearch.propTypes = {
  title: PropTypes.string,
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  loadingState: PropTypes.bool,
};
