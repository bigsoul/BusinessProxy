// react
import React, { Component, forwardRef } from "react";
// react-redux
import { connect } from "react-redux";
// constants
import { REPORT_CURRENT_DEL } from "./../../types/TAction";
// classes
import { reportRefresh, setReports, delReports, updReports, conform } from "../../classes/Requests";
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
import { makeStyles } from "@material-ui/core/styles";
// others
import moment from "moment";

import IStore from "../../interfaces/IStore";
import IReport from "../../interfaces/IReport";

const tableIcons = {
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

interface IReportsProps {
  reports: IReport[];
  contractId: string;
}

interface IReportTable extends IReport {
  tableData?: { editing: string; id: number };
}

function Reports(props: IReportsProps) {
  const columns: Column<IReport>[] = [
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
      field: "",
      initialEditValue: "",
      render: startMatching,
    },
  ];

  return (
    <>
      <Button variant="outlined" color="secondary" size="small" style={{ marginTop: "10px", marginLeft: "10px" }} onClick={beackOnClick}>
        {"Назад к списку договоров"}
      </Button>
      <Button
        variant="outlined"
        color="primary"
        size="small"
        style={{ marginTop: "10px", marginRight: "10px", float: "right" }}
        onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => reportRefresh(e, props.contractId)}
      >
        {"Обновить"}
      </Button>
      <MaterialTable
        icons={tableIcons}
        title="Список отчетов по договору: "
        columns={columns}
        data={props.reports}
        localization={{
          header: { actions: "" },
          toolbar: {
            searchTooltip: "Найти договор ...",
            searchPlaceholder: "Найти договор ...",
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

                setReports(newData.id, props.contractId, newData.name, newData.state);
              }, 0);
            }),
          onRowUpdate: (newData: IReport, oldData: IReportTable | undefined) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                const dataUpdate = [...props.reports];

                if (!oldData || !oldData.tableData) {
                  resolve();
                  return;
                }

                const index = oldData.tableData.id;
                dataUpdate[index] = newData;

                resolve();

                updReports(newData.id, props.contractId, newData);
              }, 0);
            }),
          onRowDelete: (oldData: IReportTable | undefined) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                const dataDelete = [...props.reports];

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
}

function startMatching(rowData: IReport) {
  if (rowData && rowData.state === "Новый") {
    return (
      <div>
        <Button variant="outlined" size="small" color="primary" style={{ float: "right" }} onClick={() => conform(rowData.id, true)}>
          {"Согласовать оригинал"}
        </Button>
        <Button
          variant="outlined"
          size="small"
          color="primary"
          style={{ float: "right", marginRight: "10px" }}
          onClick={() => conform(rowData.id, false)}
        >
          {"Согласовать черновик"}
        </Button>
        <Button
          variant="outlined"
          size="small"
          color="primary"
          style={{ float: "right", marginRight: "10px" }}
          onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => reportOnClick(e, rowData)}
        >
          {"Изменить файлы"}
        </Button>
      </div>
    );
  } else if (rowData && rowData.state === "К регистрации") {
    return (
      <div>
        <Button variant="outlined" size="small" color="primary" style={{ float: "right" }} onClick={() => conform(rowData.id, true)}>
          {"Согласовать оригинал"}
        </Button>
        <Button
          variant="outlined"
          size="small"
          color="primary"
          style={{ float: "right", marginRight: "10px" }}
          onClick={(e) => reportOnClick(e, rowData)}
        >
          {"Изменить файлы"}
        </Button>
      </div>
    );
  } else if (rowData) {
    return (
      <Button
        variant="outlined"
        size="small"
        color="primary"
        style={{ float: "right" }}
        onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => reportOnClick(e, rowData)}
      >
        {"Просмотреть файлы"}
      </Button>
    );
  }
}

function reportOnClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>, rowData: IReport) {
  e.stopPropagation();

  window.store.dispatch({
    type: "FILE_CURRENT_SET",
    contractId: rowData.contractId,
    reportId: rowData.id,
  });
}

const beackOnClick = () => {
  window.store.dispatch({ type: "REPORT_CURRENT_DEL" });
};

const mapStateToProps = (state: IStore, ownProps: IReportsProps): IReportsProps => {
  return {
    contractId: state.contractId,
    reports: state.reports,
  };
};

export default connect(mapStateToProps)(Reports);
