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
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";

import {
  fileUpload,
  getFiles,
  setFiles,
  updFiles,
  delFiles,
} from "../../classes/requests";

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
      title: "Тип",
      field: "type",
      initialEditValue: "",
      render: (rowData) => generateSelect(rowData, props.contractId),
    },
    {
      title: "",
      field: "",
      initialEditValue: "",
      render: (rowData) => generateButton(rowData, props.contractId),
    },
  ];

  return (
    <>
      <Button
        variant="outlined"
        color="secondary"
        size="small"
        style={{ marginTop: "10px", marginLeft: "10px" }}
        onClick={beackOnClickContract}
      >
        {"Назад к списку договоров"}
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        size="small"
        style={{ marginTop: "10px", marginLeft: "10px" }}
        onClick={(e) => beackOnClickReport(props.contractId, e)}
      >
        {"Назад к списку отчетов"}
      </Button>
      <Button
        variant="outlined"
        color="primary"
        size="small"
        style={{ marginTop: "10px", marginRight: "10px", float: "right" }}
        onClick={() => getFiles(props.contractId, props.reportId)}
      >
        {"Обновить"}
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

                setFiles(
                  newData.id,
                  props.contractId,
                  props.reportId,
                  newData.name,
                  newData.type
                );
              }, 0);
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                const dataUpdate = [...props.files];
                const index = oldData.tableData.id;
                dataUpdate[index] = newData;

                resolve();

                updFiles(
                  newData.id,
                  props.contractId,
                  props.reportId,
                  newData.name,
                  newData.type
                );
              }, 0);
            }),
          onRowDelete: (oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                const dataDelete = [...props.files];
                const index = oldData.tableData.id;
                const elem = dataDelete.splice(index, 1);

                resolve();

                delFiles(elem[0].id, props.contractId, props.reportId);
              }, 0);
            }),
        }}
      />
    </>
  );
}

function generateButton(rowData, contractId) {
  if (rowData && !rowData.loaded) {
    return (
      <div>
        <UploadButtons rowData={rowData} contractId={contractId} />
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
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
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
        onChange={(e) => fileUpload(e, props.rowData, props.contractId)}
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

/*const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));*/

function generateSelect(rowData, contractId) {
  const classes = {
    margin: "100px",
    minWidth: "120px",
  };

  const handleChange = (event) => {
    updFiles(
      rowData.id,
      contractId,
      rowData.reportId,
      rowData.name,
      event.target.value
    );
  };

  return (
    <FormControl className={classes}>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={rowData.type ? rowData.type : 0}
        onChange={handleChange}
        className={{ minWidth: "120px" }}
      >
        <MenuItem value={0}>выберите тип документа ...</MenuItem>
        <MenuItem value={10}>Акт о приемке выполненых работ КС2</MenuItem>
        <MenuItem value={20}>
          Справка о стоимости выполненных работ КС3
        </MenuItem>
        <MenuItem value={30}>Исполнительная документация</MenuItem>
      </Select>
    </FormControl>
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
