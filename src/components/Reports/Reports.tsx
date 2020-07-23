// react
import React, { Component, forwardRef } from "react";
// react-redux
import { connect } from "react-redux";
// constants
import { REPORT_CURRENT_DEL, IReportCurrentDelAction } from "./../../types/TAction";
// interfaces
import IStore from "../../interfaces/IStore";
import IReport from "../../interfaces/IReport";
// classes
import { reportRefresh, setReports, delReports, updReports } from "../../classes/Requests";
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
// classes-material-ui
import { createStyles, withStyles, WithStyles, Theme } from "@material-ui/core/styles";
// components
import ReportsRowControl from "./ReportsRowControl/ReportsRowControl";
// others
import moment from "moment";
import IUser from "../../interfaces/IUser";
import { RouterState } from "connected-react-router";
import { LocationState } from "history";

// difination styling plan

type TStyleClasses = "backInConracts" | "refreshReports" | "nameHeadTableCell" | "stateHeadTableCell" | "buttonTableCell";

const sourceStyles: Record<TStyleClasses, {}> = {
  backInConracts: { marginTop: "10px", marginLeft: "10px" },
  refreshReports: { marginTop: "10px", marginRight: "10px", float: "right" },
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
          return <ReportsRowControl rowData={rowData} />;
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

  handleBeackOnClick = (): void => {
    window.store.dispatch<IReportCurrentDelAction>({ type: REPORT_CURRENT_DEL });
  };

  render = (): JSX.Element => {
    const { router, reports, classes } = this.props;
    const { columns } = this.state;
    const { tableIcons } = this;

    //console.log((router.location as any).query);

    const contractId = (router.location as any).query["contractId"];

    return (
      <>
        <Button className={classes.backInConracts} variant="outlined" color="secondary" size="small" onClick={this.handleBeackOnClick}>
          {"Назад к списку договоров"}
        </Button>
        <Button
          className={classes.refreshReports}
          variant="outlined"
          color="primary"
          size="small"
          onClick={(): void => reportRefresh(contractId)}
        >
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
                setTimeout(() => {
                  resolve();

                  setReports(newData.id, contractId, newData.name, newData.state);
                }, 0);
              }),
            onRowUpdate: (newData: IReport, oldData: IReportTable | undefined) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  const dataUpdate = [...reports];

                  if (!oldData || !oldData.tableData) {
                    resolve();
                    return;
                  }

                  const index = oldData.tableData.id;
                  dataUpdate[index] = newData;

                  resolve();

                  updReports(newData.id, contractId, newData);
                }, 0);
              }),
            onRowDelete: (oldData: IReportTable | undefined) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  const dataDelete = [...reports];

                  if (!oldData || !oldData.tableData) {
                    resolve();
                    return;
                  }

                  const index = oldData.tableData.id;
                  const elem = dataDelete.splice(index, 1);

                  resolve();

                  delReports(elem[0].id, elem[0].contractId);
                }, 0);
              }),
          }}
        />
      </>
    );
  };
}

const mapStateToProps = (state: IStore, ownProps: IReportsProps): IReportsProps => {
  const { user, reports, router } = state;
  return {
    user: user,
    reports: reports.list,
    router: router,
    classes: ownProps.classes,
  };
};

export default withStyles(styles)(connect(mapStateToProps)(Reports));
