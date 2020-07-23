// react
import React, { Component, forwardRef } from "react";
// react-redux
import { connect } from "react-redux";
// constants
import { REPORT_CURRENT_DEL, REPORT_CURRENT_SET, IReportCurrentDelAction, IReportCurrentSetAction } from "./../../types/TAction";
// interfaces
import IStore from "../../interfaces/IStore";
import IFile from "../../interfaces/IFile";
// classes
import { getFiles, setFiles, updFiles, delFiles } from "../../classes/Requests";
// components-material-ui
import Button from "@material-ui/core/Button";
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
import MaterialTable, { Column } from "material-table";
// components
import FilesRowControlSelect from "./FilesRowControlSelect/FilesRowControlSelect";
import FilesRowControlButton from "./FilesRowControlButton/FilesRowControlButton";
// classes-material-ui
import { createStyles, withStyles, WithStyles, Theme } from "@material-ui/core/styles";

// difination styling plan

type TStyleClasses = "beackOnClickContract" | "beackOnClickReport" | "getFiles";

const sourceStyles: Record<TStyleClasses, {}> = {
  beackOnClickContract: { marginTop: "10px", marginLeft: "10px" },
  beackOnClickReport: { marginTop: "10px", marginLeft: "10px" },
  getFiles: { marginTop: "10px", marginRight: "10px", float: "right" },
};

let styles = (theme: Theme) => createStyles<TStyleClasses, {}>(sourceStyles);

// own interfaces

interface IFilesTable extends IFile {
  tableData?: { editing: string; id: number };
}

interface IFilesProps extends WithStyles<typeof styles> {
  contractId: string;
  reportId: string;
  files: IFile[];
}

interface IFilesState {
  columns: Column<IFile>[];
}

export class Files extends Component<IFilesProps, IFilesState> {
  constructor(props: IFilesProps) {
    super(props);

    console.log("Files: constructor");
  }

  state: IFilesState = {
    columns: [
      { title: "Name", field: "name", initialEditValue: "" },
      {
        title: "Тип",
        field: "type",
        initialEditValue: "",
        render: (rowData: IFile) => {
          return <FilesRowControlSelect rowData={rowData} contractId={this.props.contractId} />;
        },
      },
      {
        title: "",
        field: "buttom",
        initialEditValue: "",
        render: (rowData: IFile) => {
          return <FilesRowControlButton rowData={rowData} contractId={this.props.contractId} />;
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

  handleBeackOnClickContract = (): void => {
    window.store.dispatch<IReportCurrentDelAction>({ type: REPORT_CURRENT_DEL });
  };

  handleBeackOnClickReport = (id: string, e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    e.preventDefault();
    window.store.dispatch<IReportCurrentSetAction>({ type: REPORT_CURRENT_SET, contractId: id });
  };

  render = (): JSX.Element => {
    const { classes, contractId, reportId, files } = this.props;
    const { columns } = this.state;
    const { tableIcons } = this;

    return (
      <>
        <Button
          className={classes.beackOnClickContract}
          variant="outlined"
          color="secondary"
          size="small"
          onClick={this.handleBeackOnClickContract}
        >
          {"Назад к списку договоров"}
        </Button>
        <Button
          className={classes.beackOnClickReport}
          variant="outlined"
          color="secondary"
          size="small"
          onClick={(e) => this.handleBeackOnClickReport(contractId, e)}
        >
          {"Назад к списку отчетов"}
        </Button>
        <Button className={classes.getFiles} variant="outlined" color="primary" size="small" onClick={() => getFiles(contractId, reportId)}>
          {"Обновить"}
        </Button>
        <MaterialTable
          icons={tableIcons}
          title="Список файлов по отчету: "
          columns={columns}
          data={files}
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
            onRowAdd: (newData: IFile) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  resolve();

                  setFiles(newData.id, contractId, reportId, newData.name, newData.type);
                }, 0);
              }),
            onRowUpdate: (newData: IFile, oldData: IFilesTable | undefined) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  const dataUpdate = [...files];

                  if (!oldData || !oldData.tableData) {
                    resolve();
                    return;
                  }

                  const index = oldData.tableData.id;
                  dataUpdate[index] = newData;

                  resolve();

                  updFiles(newData.id, contractId, reportId, newData.name, newData.type);
                }, 0);
              }),
            onRowDelete: (oldData: IFilesTable) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  const dataDelete = [...files];

                  if (!oldData || !oldData.tableData) {
                    resolve();
                    return;
                  }

                  const index = oldData.tableData.id;
                  const elem = dataDelete.splice(index, 1);

                  resolve();

                  delFiles(elem[0].id, contractId, reportId);
                }, 0);
              }),
          }}
        />
      </>
    );
  };
}

/*const mapStateToProps = (state: IStore, ownProps: IFilesProps): IFilesProps => {
  const { app } = state;
  return {
    files: app.files,
    reportId: app.reportId,
    contractId: app.contractId,
    classes: ownProps.classes,
  };
};*/

export default withStyles(styles)(connect()(Files));
