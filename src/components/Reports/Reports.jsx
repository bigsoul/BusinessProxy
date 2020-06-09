import React, { Component } from "react";
import ReactDOM from "react-dom";
import MaterialTable from "material-table";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

import { forwardRef } from "react";

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
import { connect } from "react-redux";
import Icon from "@material-ui/core/Icon";
import {
  reportRefresh,
  setReports,
  delReports,
  updReports,
  conform,
} from "../../classes/requests";
import moment from "moment";

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

function Reports(props) {
  const columns = [
    {
      title: "Наименование",
      field: "name",
      initialEditValue: "Отчет от " + moment().format().substr(0, 10),
    },
    {
      title: "Состояние",
      field: "state",
      initialEditValue: "Новый",
      readonly: true,
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
      <Button
        variant="outlined"
        color="secondary"
        size="small"
        style={{ marginTop: "10px", marginLeft: "10px" }}
        onClick={beackOnClick}
      >
        {"Назад к списку договоров"}
      </Button>
      <Button
        variant="outlined"
        color="primary"
        size="small"
        style={{ marginTop: "10px", marginRight: "10px", float: "right" }}
        onClick={(e) => reportRefresh(e, props.contractId)}
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
          onRowAdd: (newData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                resolve();

                setReports(
                  newData.id,
                  props.contractId,
                  newData.name,
                  newData.state
                );
              }, 0);
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                const dataUpdate = [...props.reports];
                const index = oldData.tableData.id;
                dataUpdate[index] = newData;

                resolve();

                updReports(newData.id, props.contractId, newData);
              }, 0);
            }),
          onRowDelete: (oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                const dataDelete = [...props.reports];
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

function startMatching(rowData) {
  if (rowData && rowData.state === "Новый") {
    return (
      <div>
        <Button
          variant="outlined"
          size="small"
          color="primary"
          style={{ float: "right" }}
          onClick={() => conform(rowData.id)}
        >
          {"Согласовать"}
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
        onClick={(e) => reportOnClick(e, rowData)}
      >
        {"Просмотреть файлы"}
      </Button>
    );
  }
}

function onClickStartMatching(e, rowData) {
  e.stopPropagation();
}

function reportOnClick(e, rowData) {
  e.stopPropagation();

  window.store.dispatch({
    type: "FILE-CURRENT-SET",
    contractId: rowData.contractId,
    reportId: rowData.id,
  });
}

const beackOnClick = () => {
  window.store.dispatch({ type: "REPORT-CURRENT-DEL" });
};

const mapStateToProps = (state, ownProps) => {
  return {
    contractId: state.contractId,
    reports: state.reports,
  };
};

export default connect(mapStateToProps)(Reports);
