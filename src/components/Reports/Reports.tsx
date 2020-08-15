// react
import React, { Component, forwardRef } from "react";
// react-redux
import { connect } from "react-redux";
// constants
import {
  IGetReportsAction,
  GET_REPORTS,
  TAction,
  ISetReportsAction,
  SET_REPORTS,
  IUpdReportsAction,
  UPD_REPORTS,
  DEL_REPORTS,
  IDelReportsAction,
  IReportsClearErrorAction,
  REPORTS_CLEAR_ERROR,
} from "./../../types/TAction";
// interfaces
import IStore from "../../interfaces/IStore";
import IReport from "../../interfaces/IReport";
// components-material-ui
import AddBox from "@material-ui/icons/AddBox";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";
import Button from "@material-ui/core/Button";
import MaterialTable, { Column } from "material-table";
import MuiAlert from "@material-ui/lab/Alert";
// classes-material-ui
import { createStyles, withStyles, WithStyles, Theme } from "@material-ui/core/styles";
// components
import ReportsRowControl from "./ReportsRowControl/ReportsRowControl";
// others
import moment from "moment";
import IUser from "../../interfaces/IUser";
import { RouterState } from "connected-react-router";
import { LocationState } from "history";
import { Dispatch } from "redux";
import { Snackbar } from "@material-ui/core";

// difination styling plan

type TStyleClasses = "refreshReports" | "nameHeadTableCell" | "stateHeadTableCell" | "buttonTableCell";

const sourceStyles: Record<TStyleClasses, {}> = {
  refreshReports: { marginTop: "10px", marginRight: "10px" },
  nameHeadTableCell: { minWidth: 170 },
  stateHeadTableCell: { minWidth: 100 },
  buttonTableCell: { float: "right" },
};

let styles = (theme: Theme) => createStyles<TStyleClasses, {}>(sourceStyles);

// own interfaces

interface IReportTable extends IReport {
  tableData?: { editing: string; id: number };
}

interface IReportsProps extends WithStyles<typeof styles> {
  user: IUser;
  reports: IReport[];
  router: RouterState<LocationState>;
  errorText?: string;
  getReportsAction?: (apikey: string, contractId: string) => void;
  setReportsAction?: (apikey: string, reports: IReport[]) => void;
  updReportsAction?: (apikey: string, reports: IReport[]) => void;
  delReportsAction?: (apikey: string, reports: IReport[]) => void;
  reportsClearErrorAction?: () => void;
}

interface IReportsState {
  columns: Column<IReport>[];
}

class Reports extends Component<IReportsProps, IReportsState> {
  state: IReportsState = {
    columns: [
      {
        title: "Наименование",
        field: "name",
        initialEditValue: "Отчет от " + moment().format().substr(0, 10),
      },
      {
        title: "Состояние",
        field: "state",
        initialEditValue: "Новый",
        editable: "never",
      },
      {
        title: "",
        field: "buttom",
        initialEditValue: "",
        render: (rowData: IReport) => {
          const { user } = this.props;
          return <ReportsRowControl user={user} reportId={rowData.id} state={rowData.state} />;
        },
      },
    ],
  };

  tableIcons = {
    Add: forwardRef<SVGSVGElement, {}>((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef<SVGSVGElement, {}>((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef<SVGSVGElement, {}>((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef<SVGSVGElement, {}>((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef<SVGSVGElement, {}>((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef<SVGSVGElement, {}>((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef<SVGSVGElement, {}>((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef<SVGSVGElement, {}>((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef<SVGSVGElement, {}>((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef<SVGSVGElement, {}>((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef<SVGSVGElement, {}>((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef<SVGSVGElement, {}>((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef<SVGSVGElement, {}>((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef<SVGSVGElement, {}>((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef<SVGSVGElement, {}>((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef<SVGSVGElement, {}>((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef<SVGSVGElement, {}>((props, ref) => <ViewColumn {...props} ref={ref} />),
  };

  componentDidMount = () => {
    this.handleGetReportsAction();
  };

  handleGetReportsAction = (): void => {
    const { getReportsAction, user, router } = this.props;
    const contractId = (router.location as any).query["contractId"] || "";
    getReportsAction && getReportsAction(user.apikey, contractId);
  };

  handleSetReportsAction = (reports: IReport[]): void => {
    const { setReportsAction, user } = this.props;
    setReportsAction && setReportsAction(user.apikey, reports);
  };

  handleUpdReportsAction = (reports: IReport[]): void => {
    const { updReportsAction, user } = this.props;
    updReportsAction && updReportsAction(user.apikey, reports);
  };

  handleDelReportsAction = (reports: IReport[]): void => {
    const { delReportsAction, user } = this.props;
    delReportsAction && delReportsAction(user.apikey, reports);
  };

  hendleReportsClearErrorAction = (): void => {
    const { reportsClearErrorAction } = this.props;
    reportsClearErrorAction && reportsClearErrorAction();
  };

  render = (): JSX.Element => {
    const { router, reports, classes, errorText } = this.props;
    const { columns } = this.state;
    const { tableIcons } = this;

    const contractId = (router.location as any).query["contractId"];

    return (
      <>
        <Button className={classes.refreshReports} variant="outlined" color="primary" size="small" onClick={this.handleGetReportsAction}>
          {"Обновить"}
        </Button>
        <MaterialTable
          icons={tableIcons}
          title="Список отчетов по договору: "
          columns={columns}
          data={reports}
          localization={{
            header: { actions: "" },
            toolbar: {
              searchTooltip: "Найти отчет ...",
              searchPlaceholder: "Найти отчет ...",
            },
            pagination: { labelRowsSelect: "строк" },
            body: { editRow: { deleteText: "Вы уверены ?" } },
          }}
          onRowClick={() => {}}
          editable={{
            onRowAdd: (newData: IReport) =>
              new Promise((resolve, reject) => {
                const reports: IReport[] = [
                  {
                    id: newData.id || "",
                    name: newData.name,
                    state: newData.state,
                    files: [],
                    contractId: contractId,
                  },
                ];
                this.handleSetReportsAction(reports);
                resolve();
              }),
            onRowUpdate: (newData: IReport, oldData: IReportTable | undefined) =>
              new Promise((resolve, reject) => {
                const reports: IReport[] = [
                  {
                    id: newData.id,
                    name: newData.name,
                    state: newData.state,
                    files: [],
                    contractId: contractId,
                  },
                ];

                this.handleUpdReportsAction(reports);

                resolve();
              }),
            onRowDelete: (oldData: IReportTable | undefined) =>
              new Promise((resolve, reject) => {
                if (!oldData || !oldData.tableData) {
                  resolve();
                  return;
                }

                const reports: IReport[] = [
                  {
                    id: oldData.id,
                    name: oldData.name,
                    state: oldData.state,
                    files: [],
                    contractId: contractId,
                  },
                ];

                this.handleDelReportsAction(reports);

                resolve();
              }),
          }}
        />
        {/** Обратная связь + */}
        <Snackbar open={!!errorText} autoHideDuration={3000} onClose={this.hendleReportsClearErrorAction}>
          <MuiAlert elevation={6} variant="filled" severity="error" onClose={this.hendleReportsClearErrorAction}>
            {errorText}
          </MuiAlert>
        </Snackbar>
        {/** Обратная связь - */}
      </>
    );
  };
}

const mapStateToProps = (state: IStore, ownProps: IReportsProps): IReportsProps => {
  const { user, reports, router } = state;
  return {
    user: user,
    reports: reports.table.list,
    router: router,
    errorText: reports.table.errorText,
    classes: ownProps.classes,
    getReportsAction: ownProps.getReportsAction,
    setReportsAction: ownProps.setReportsAction,
    updReportsAction: ownProps.updReportsAction,
    delReportsAction: ownProps.delReportsAction,
    reportsClearErrorAction: ownProps.reportsClearErrorAction,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<TAction>) => {
  return {
    getReportsAction: (apikey: string, contractId: string): void => {
      dispatch<IGetReportsAction>({
        type: GET_REPORTS,
        apikey: apikey,
        contractId: contractId,
      });
    },
    setReportsAction: (apikey: string, reports: IReport[]): void => {
      dispatch<ISetReportsAction>({
        type: SET_REPORTS,
        apikey: apikey,
        list: reports,
      });
    },
    updReportsAction: (apikey: string, reports: IReport[]): void => {
      dispatch<IUpdReportsAction>({
        type: UPD_REPORTS,
        apikey: apikey,
        list: reports,
      });
    },
    delReportsAction: (apikey: string, reports: IReport[]): void => {
      dispatch<IDelReportsAction>({
        type: DEL_REPORTS,
        apikey: apikey,
        list: reports,
      });
    },
    reportsClearErrorAction: (): void => {
      dispatch<IReportsClearErrorAction>({
        type: REPORTS_CLEAR_ERROR,
      });
    },
  };
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Reports));
