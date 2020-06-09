import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import { contractRefresh } from "../../classes/requests";

const columns = [
  { id: "name", label: "Наименование", minWidth: 170 },
  { id: "state", label: "Состояние", minWidth: 100 },
];

const useStyles = makeStyles({
  root: {
    width: "100%",
    height: "85%",
  },
  container: {
    maxHeight: "100%",
  },
});

function StickyHeadTable(props) {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
              <TableCell key={"-1"}>
                <Button
                  variant="outlined"
                  size="small"
                  color="primary"
                  style={{ float: "right" }}
                  onClick={(e) => contractRefresh(e)}
                >
                  {"Обновить"}
                </Button>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.contracts
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.id}
                    onClick={(e) => {}}
                  >
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === "number"
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                    <TableCell key={"-1"}>
                      <Button
                        variant="outlined"
                        size="small"
                        color="primary"
                        style={{ float: "right" }}
                        onClick={(e) => contractOnClick(row.id, e)}
                      >
                        {"Просмотреть отчеты"}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={props.contracts.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

function contractOnClick(id, e) {
  e.preventDefault();
  window.store.dispatch({ type: "REPORT-CURRENT-SET", contractId: id });
}

const mapStateToProps = (state, ownProps) => {
  return {
    contracts: state.contracts,
  };
};

export default connect(mapStateToProps)(StickyHeadTable);
