import React from "react";
import PropTypes from "prop-types";
import useDeepCompareEffect from "use-deep-compare-effect";
import { Paper, Toolbar, Typography, InputBase } from "@material-ui/core";
import { makeStyles, fade } from "@material-ui/core/styles";
import { Search as SearchIcon } from "@material-ui/icons";

import { TableWithSorting, SwipeTabs } from "..";
import { getCellData } from "../../shared/utility";

const useStyles = makeStyles((theme) => ({
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

const TableWithTabs = ({ tabPanelsData, loadingState, menuOptions }) => {
  const classes = useStyles();
  const [search, setSearch] = React.useState("");
  const [tabPanels, setTabPanels] = React.useState([]);

  useDeepCompareEffect(() => {
    setTabPanels(
      tabPanelsData.map((data, index) => {
        const filteredData = data.rowData.filter((row) => {
          return data.columnData.some((column) => {
            if (column.selector) {
              if (getCellData(row, column.selector))
                return getCellData(row, column.selector)
                  .toLowerCase()
                  .includes(search.toLowerCase());
            }
            return "";
          });
        });
        return {
          label: data.tabLabel,
          content: () => (
            <TableWithSorting
              rows={filteredData}
              columns={data.columnData}
              loadingState={loadingState}
              menuOptions={menuOptions}
            />
          ),
        };
      })
    );
  }, [tabPanelsData, loadingState, search, menuOptions]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  return (
    <Paper>
      <Toolbar>
        <Typography className={classes.title} variant='h5' noWrap>
          Stories
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
      <SwipeTabs tabPanels={tabPanels} />
    </Paper>
  );
};

export default TableWithTabs;

TableWithTabs.propTypes = {
  tabPanelsData: PropTypes.arrayOf(PropTypes.object).isRequired,
  loadingState: PropTypes.bool,
  menuOptions: PropTypes.object,
};

// const tabPanels = tabPanelsData.map((data, index) => {
//   const filteredData = data.rowData.filter((row) => {
//     return data.columnData.some((column) => {
//       if (column.selector)
//         return row[`${column.selector}`]
//           .toLowerCase()
//           .includes(search.toLowerCase());
//       return null;
//     });
//   });
//   return {
//     label: data.tabLabel,
//     content: () => (
//       <TableWithSorting
//         rows={filteredData}
//         columns={data.columnData}
//         loadingState={loadingState}
//       />
//     ),
//   };
// });
