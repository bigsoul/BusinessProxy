// react
import React, { Component } from "react";
// react-redux
import { connect } from "react-redux";
// constants
import { IReportAddSimplyAction, REPORT_SIMPLY, TAction, IGetContractsAction, GET_CONTRACTS } from "../../types/TAction";
// types
import { TContractFields } from "./../../interfaces/IContract";
// interfaces
import IStore from "../../interfaces/IStore";
import IContract from "../../interfaces/IContract";
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
import IUser from "../../interfaces/IUser";
import { Dispatch } from "redux";

// difination styling plan

type TStyleClasses =
  | "paper"
  | "tableContainer"
  | "nameHeadTableCell"
  | "stateHeadTableCell"
  | "refreshContracts"
  | "buttonTableCell"
  | "buttonAddReport";

const sourceStyles: Record<TStyleClasses, {}> = {
  paper: { width: "100%", height: "85%" },
  tableContainer: { maxHeight: "100%" },
  nameHeadTableCell: { minWidth: 170 },
  stateHeadTableCell: { minWidth: 100 },
  buttonTableCell: { float: "right" },
  refreshContracts: { float: "right" },
  buttonAddReport: { float: "right", marginRight: "10px" },
};

let styles = (theme: Theme) => createStyles<TStyleClasses, {}>(sourceStyles);

// own interfaces

interface IContractsTableCellProps extends TableCellProps {
  id: TContractFields;
  styleClass: TStyleClasses;
  label: string;
}

const columns: IContractsTableCellProps[] = [
  { id: "name", styleClass: "nameHeadTableCell", label: "Наименование", align: "left" },
  { id: "state", styleClass: "stateHeadTableCell", label: "Состояние", align: "left" },
];

interface IContractsProps extends WithStyles<typeof styles> {
  user: IUser;
  contracts: IContract[];
  getContractsAction?: (apikey: string) => void;
}

interface IContractsState {
  page: number;
  rowsPerPage: number;
}

class Contracts extends Component<IContractsProps, IContractsState> {
  state: IContractsState = {
    page: 0,
    rowsPerPage: 10,
  };

  handleChangePage = (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number): void => {
    this.setState({ page: newPage });
  };

  handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    this.setState({ page: 0, rowsPerPage: +e.target.value });
  };

  hendleGetContractsAction = (): void => {
    const { getContractsAction, user } = this.props;
    getContractsAction && getContractsAction(user.apikey);
  };

  handleGetReportsAction = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string): void => {
    window._history.push(`/reports?contractId=${id}`);
  };

  handleWizardReportsAction = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string): void => {
    window._history.push(`/reports/wizard?contractId=${id}`);
    //window.store.dispatch<IReportAddSimplyAction>({ type: REPORT_SIMPLY, path: "ReportAddSimply", contractId: id });
  };

  render = (): JSX.Element => {
    const { classes, contracts } = this.props;
    const { page, rowsPerPage } = this.state;

    return (
      <Paper className={classes["paper"]}>
        <TableContainer className={classes["tableContainer"]}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column: IContractsTableCellProps) => (
                  <TableCell key={column.id} className={classes[column.styleClass]} align={column.align}>
                    {column.label}
                  </TableCell>
                ))}
                <TableCell key={"-1"}>
                  <Button
                    className={classes["refreshContracts"]}
                    variant="outlined"
                    size="small"
                    color="primary"
                    onClick={() => this.hendleGetContractsAction()}
                  >
                    {"Обновить"}
                  </Button>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contracts?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row: IContract) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id} onClick={() => {}}>
                    {columns.map((column: IContractsTableCellProps) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {value}
                        </TableCell>
                      );
                    })}
                    <TableCell key={"-1"}>
                      <Button
                        className={classes["buttonTableCell"]}
                        variant="outlined"
                        size="small"
                        color="primary"
                        onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => this.handleGetReportsAction(e, row.id)}
                      >
                        {"Просмотреть отчеты"}
                      </Button>
                      <Button
                        className={classes["buttonAddReport"]}
                        variant="outlined"
                        size="small"
                        color="primary"
                        onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => this.handleWizardReportsAction(e, row.id)}
                      >
                        {"Добавить отчет"}
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
          count={contracts ? contracts.length : 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
      </Paper>
    );
  };
}

const mapStateToProps = (state: IStore, ownProps: IContractsProps): IContractsProps => {
  const { user, contracts } = state;
  return {
    user: user,
    contracts: contracts.list,
    getContractsAction: ownProps.getContractsAction,
    classes: ownProps.classes,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<TAction>) => {
  return {
    getContractsAction: (apikey: string): void => {
      dispatch<IGetContractsAction>({
        type: GET_CONTRACTS,
        apikey: apikey,
      });
    },
  };
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Contracts));
