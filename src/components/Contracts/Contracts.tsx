// react
import React, { Component, ReactElement } from "react";
// react-redux
import { connect } from "react-redux";
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
import { createStyles, withStyles, WithStyles, Theme, styled } from "@material-ui/core/styles";

// difination styling plan

type TStyleClasses = "paper" | "tableContainer" | "nameHeadTableCell" | "stateHeadTableCell" | "buttonTableCell";

const sourceStyles: Record<TStyleClasses, {}> = {
  paper: { width: "100%", height: "85%" },
  tableContainer: { maxHeight: "100%", background: "red" },
  nameHeadTableCell: { minWidth: 170 },
  stateHeadTableCell: { minWidth: 100 },
  buttonTableCell: { float: "right" },
};

let styles = (theme: Theme) => createStyles<TStyleClasses, {}>(sourceStyles);

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
  contracts: IContract[];
}

class Contracts extends Component<IContractsProps> {
  state = {
    page: 0,
    rowsPerPage: 10,
  };

  constructor(props: IContractsProps) {
    super(props);

    console.log("Contracts: constructor");
  }

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
                    className={classes["buttonTableCell"]}
                    variant="outlined"
                    size="small"
                    color="primary"
                    onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => contractRefresh(e)}
                  >
                    {"Обновить"}
                  </Button>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contracts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row: IContract) => {
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

  componentDidMount = (): void => {
    console.log("Contracts: componentDidMount");
  };

  componentWillUnmount = (): void => {
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
