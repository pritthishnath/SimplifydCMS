import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Paper,
  CircularProgress,
} from "@material-ui/core";

import { Menu } from "..";
import { getCellData } from "../../shared/utility";

function LoadingCircle({ classes, colLength }) {
  return (
    <TableRow style={{ height: 150 }}>
      <TableCell colSpan={colLength}>
        <div className={classes.loadingCircle}>
          <CircularProgress thickness={4} size={100} />
        </div>
      </TableCell>
    </TableRow>
  );
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort, columns } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {columns.map((column, index) => (
          <TableCell
            key={index}
            align={column.align ? column.align : "left"}
            sortDirection={orderBy === column.selector ? order : false}>
            <TableSortLabel
              active={orderBy === column.selector}
              direction={orderBy === column.selector ? order : "asc"}
              onClick={createSortHandler(column.selector)}>
              {column.label}
              {orderBy === column.selector ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        {props.menu && <TableCell></TableCell>}
      </TableRow>
    </TableHead>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    width: "100%",
  },
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
}));

const TableWithSorting = ({ rows, columns, loadingState, menuProps }) => {
  const classes = useStyles();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <Paper className={classes.paper}>
      <TableContainer>
        <Table className={classes.table}>
          <EnhancedTableHead
            classes={classes}
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            columns={columns}
            menu={menuProps ? true : false}
          />
          <TableBody>
            {loadingState ? (
              <LoadingCircle classes={classes} colLength={columns.length} />
            ) : (
              stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  return (
                    <TableRow hover key={index}>
                      {columns.map((column, index) => (
                        <TableCell
                          key={index}
                          align={column.align ? column.align : "left"}>
                          {column.cell
                            ? column.cell(row)
                            : getCellData(row, column.selector)}
                        </TableCell>
                      ))}
                      {menuProps && (
                        <TableCell align='right'>
                          <Menu menuProps={menuProps} data={row} />
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })
            )}
            {loadingState
              ? null
              : emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={columns.length + 1} />
                  </TableRow>
                )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component='div'
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default TableWithSorting;

TableWithSorting.propTypes = {
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  loadingState: PropTypes.bool,
  menuProps: PropTypes.object,
};
