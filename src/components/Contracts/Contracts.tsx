// react
import React, { Component } from "react";
// react-redux
import { connect } from "react-redux";
// components-material-ui
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import Button from "@material-ui/core/Button";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell, { TableCellProps } from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableContainer from "@material-ui/core/TableContainer";
import TablePagination from "@material-ui/core/TablePagination";
// classes-material-ui
import { createStyles, withStyles, WithStyles, Theme } from "@material-ui/core/styles";
// constants
import { REPORT_CURRENT_SET } from "../../types/TAction";
// types
import { TContractFields } from "./../../interfaces/IContract";
// interfaces
import { IReportCurrentSetAction } from "../../types/TAction";
import IStore from "../../interfaces/IStore";
import IContract from "../../interfaces/IContract";
// classes
import { contractRefresh } from "../../classes/Requests";

interface MyTableCellProps extends TableCellProps {
  id: TContractFields;
  label: string;
  minWidth: number;
}

const columns: MyTableCellProps[] = [
  { id: "name", label: "Наименование", minWidth: 170, align: "left" },
  { id: "state", label: "Состояние", minWidth: 100, align: "left" },
];

const styles = (theme: Theme) =>
  createStyles({
    paper: { width: "100%", height: "85%" },
    tableContainer: { maxHeight: "100%", background: "red" },
  });

interface IContractsProps extends WithStyles<typeof styles> {
  contracts: IContract[];
}

class Contracts extends Component<IContractsProps> {
  constructor(props: IContractsProps) {
    super(props);

    console.log("Contracts: constructor");
  }

  state = {
    page: 0,
    rowsPerPage: 10,
  };

  handleChangePage = (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number): void => {
    this.setState({ page: newPage });
  };

  handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    this.setState({ page: 0, rowsPerPage: +e.target.value });
  };

  reportCurrentSetAction = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string): void => {
    e.preventDefault();
    window.store.dispatch<IReportCurrentSetAction>({ type: REPORT_CURRENT_SET, contractId: id });
  };

  render = (): JSX.Element => {
    const { classes, contracts } = this.props;
    const { page, rowsPerPage } = this.state;

    console.log("Contracts: render");

    return (
      <Paper className={classes.paper}>
        <TableContainer className={classes.tableContainer}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column: MyTableCellProps) => (
                  <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                    {column.label}
                  </TableCell>
                ))}
                <TableCell key={"-1"}>
                  <Button variant="outlined" size="small" color="primary" style={{ float: "right" }} onClick={(e) => contractRefresh(e)}>
                    {"Обновить"}
                  </Button>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contracts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row: IContract) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id} onClick={() => {}}>
                    {columns.map((column: MyTableCellProps) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {value}
                        </TableCell>
                      );
                    })}
                    <TableCell key={"-1"}>
                      <Button
                        variant="outlined"
                        size="small"
                        color="primary"
                        style={{ float: "right" }}
                        onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => this.reportCurrentSetAction(e, row.id)}
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
          count={contracts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
      </Paper>
    );
  };

  componentDidMount = () => {
    console.log("Contracts: componentDidMount");
  };

  componentWillUnmount = () => {
    console.log("Contracts: componentWillUnmount");
  };
}

const mapStateToProps = (state: IStore, ownProps: IContractsProps): IContractsProps => {
  return {
    contracts: state.contracts,
    classes: ownProps.classes,
  };
};

export default withStyles(styles)(connect(mapStateToProps)(Contracts));
