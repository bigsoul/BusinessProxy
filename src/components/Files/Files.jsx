import React, { Component } from "react";
import ReactDOM from "react-dom";
import MaterialTable from "material-table";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
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

import { fileUpload } from "../../request";

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

function Files(props) {
  const columns = [
    { title: "Name", field: "name" },
    {
      title: "",
      field: "",
      initialEditValue: "",
      render: generateButton,
    },
  ];

  return (
    <>
      <Button
        variant="outlined"
        color="secondary"
        style={{ marginTop: "10px", marginLeft: "10px" }}
        onClick={beackOnClickContract}
      >
        {"Назад к списку договоров"}
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        style={{ marginTop: "10px", marginLeft: "10px" }}
        onClick={(e) => beackOnClickReport(props.contractId, e)}
      >
        {"Назад к списку отчетов"}
      </Button>
      <MaterialTable
        icons={tableIcons}
        title="Список файлов по отчету: "
        columns={columns}
        data={props.files}
        onRowClick={() => {}}
        localization={{
          header: { actions: "" },
          toolbar: {
            searchTooltip: "Найти файл ...",
            searchPlaceholder: "Найти файл ...",
          },
          pagination: { labelRowsSelect: "строк" },
          body: { editRow: { deleteText: "Вы уверены ?" } },
        }}
        editable={{
          onRowAdd: (newData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                resolve();

                window.store.dispatch({
                  type: "FILE-ADD",
                  contractId: props.contractId,
                  reportId: props.reportId,
                  newData: newData,
                });
              }, 0);
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                const dataUpdate = [...props.files];
                const index = oldData.tableData.id;
                dataUpdate[index] = newData;

                resolve();

                window.store.dispatch({
                  type: "FILE-UPDATE",
                  contractId: props.contractId,
                  reportId: props.reportId,
                  dataUpdate: dataUpdate,
                });
              }, 0);
            }),
          onRowDelete: (oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                const dataDelete = [...props.files];
                const index = oldData.tableData.id;
                dataDelete.splice(index, 1);

                resolve();

                window.store.dispatch({
                  type: "FILE-DELETE",
                  contractId: props.contractId,
                  reportId: props.reportId,
                  dataDelete: dataDelete,
                });
              }, 0);
            }),
        }}
      />
    </>
  );
}

function generateButton(rowData) {
  if (rowData && !rowData.loaded) {
    return (
      <div>
        <UploadButtons rowData={rowData} />
      </div>
    );
  } else if (rowData) {
    return (
      <Button
        variant="outlined"
        size="small"
        style={{ float: "right" }}
        onClick={(e) => fileDownload(e, rowData)}
      >
        {"Скачать"}
      </Button>
    );
  }
}

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      float: "right",
    },
  },
  input: {
    display: "none",
  },
}));

function UploadButtons(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <input
        accept="image/*"
        className={classes.input}
        id={"upload-" + props.rowData.id}
        multiple
        type="file"
        onChange={(e) => fileUpload(e, props.rowData)}
      />
      <label htmlFor={"upload-" + props.rowData.id}>
        <Button
          variant="outlined"
          color="primary"
          component="span"
          size="small"
        >
          Загрузить
        </Button>
      </label>
    </div>
  );
}

const fileDownload = (e, rowData) => {
  e.preventDefault();
};

const beackOnClickContract = () => {
  window.store.dispatch({ type: "REPORT-CURRENT-DEL" });
};

const beackOnClickReport = (id, e) => {
  e.preventDefault();
  window.store.dispatch({ type: "REPORT-CURRENT-SET", contractId: id });
};

const mapStateToProps = (state, ownProps) => {
  return {
    files: state.files,
    reportId: state.reportId,
    contractId: state.contractId,
  };
};

export default connect(mapStateToProps)(Files);
