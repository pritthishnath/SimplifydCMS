// See the PropTypes below

import React from "react";
import PropTypes from "prop-types";
import {
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  Paper,
  CircularProgress,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

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

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  loadingCircle: {
    display: "flex",
    justifyContent: "center",
  },
}));

const TableWithPagination = ({ rows, columns, loadingState }) => {
  const classes = useStyles();

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

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
    <Paper>
      <TableContainer>
        <Table className={classes.table} size='medium'>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.selector}>{column.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loadingState ? (
              <LoadingCircle classes={classes} colLength={columns.length} />
            ) : (
              rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow key={index} hover>
                    {columns.map((column) => (
                      <TableCell key={column.selector}>
                        {row[`${column.selector}`]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
            )}
            {loadingState
              ? null
              : emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
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

export default TableWithPagination;

TableWithPagination.propTypes = {
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  loadingState: PropTypes.bool,
};
