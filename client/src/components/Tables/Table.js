import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  makeStyles,
} from "@material-ui/core";

import { Menu } from "..";
import { getCellData } from "../../shared/utility";

const useStyles = makeStyles({
  containter: {
    maxHeight: 400,
  },
  table: {
    minWidth: 500,
  },
});

const SimpleTable = ({ rows, columns, loadingState, menuOptions }) => {
  const classes = useStyles();

  return (
    <TableContainer component={Paper} classes={{ root: classes.containter }}>
      <Table className={classes.table} aria-label='simple table'>
        <TableHead>
          <TableRow>
            {columns.map((column, index) => (
              <TableCell
                key={index}
                align={column.align ? column.align : "left"}>
                {column.label}
              </TableCell>
            ))}
            {menuOptions && <TableCell></TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => {
            return (
              <TableRow hover key={index}>
                {columns.map((column, i) => (
                  <TableCell
                    key={i}
                    align={column.align ? column.align : "left"}>
                    {column.cell
                      ? column.cell(row)
                      : getCellData(row, column.selector)}
                  </TableCell>
                ))}
                {menuOptions && (
                  <TableCell align='right'>
                    <Menu menuOptions={menuOptions} data={row} />
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SimpleTable;
