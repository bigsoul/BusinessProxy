// react
import React, { Component, forwardRef } from "react";
// react-redux
import { connect } from "react-redux";
// constants
import {
  IGetFilesAction,
  GET_FILES,
  TAction,
  ISetFilesAction,
  IUpdFilesAction,
  IDelFilesAction,
  SET_FILES,
  UPD_FILES,
  DEL_FILES,
  IFilesClearErrorAction,
  FILES_CLEAR_ERROR,
} from "./../../types/TAction";
// interfaces
import IStore from "../../interfaces/IStore";
import IFile from "../../interfaces/IFile";
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
import IUser from "../../interfaces/IUser";
import { RouterState } from "connected-react-router";
import { LocationState } from "history";
import { Dispatch } from "redux";
import { Snackbar } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";

// difination styling plan

type TStyleClasses = "getFiles";

const sourceStyles: Record<TStyleClasses, {}> = {
  getFiles: { float: "right" },
};

let styles = (theme: Theme) => createStyles<TStyleClasses, {}>(sourceStyles);

// own interfaces

interface IFilesTable extends IFile {
  tableData?: { editing: string; id: number };
}

interface IFilesProps extends WithStyles<typeof styles> {
  user: IUser;
  files: IFile[];
  router: RouterState<LocationState>;
  errorText?: string;
  getFilesAction?: (apikey: string, reportId: string) => void;
  setFilesAction?: (apikey: string, files: IFile[]) => void;
  updFilesAction?: (apikey: string, files: IFile[]) => void;
  delFilesAction?: (apikey: string, files: IFile[]) => void;
  filesClearErrorAction?: () => void;
}

interface IFilesState {
  columns: Column<IFile>[];
}

export class Files extends Component<IFilesProps, IFilesState> {
  componentDidMount = () => {
    this.handleGetReportsAction();
  };

  handleGetReportsAction = () => {
    const { getFilesAction, user, router } = this.props;
    const reportId = (router.location as any).query["reportId"] || "";
    getFilesAction && getFilesAction(user.apikey, reportId);
  };

  handleSetFilesAction = (files: IFile[]): void => {
    const { setFilesAction, user, router } = this.props;
    files.forEach((element) => {
      element.reportId = (router.location as any).query["reportId"];
    });
    setFilesAction && setFilesAction(user.apikey, files);
  };

  handleUpdFilesAction = (files: IFile[]): void => {
    const { updFilesAction, user } = this.props;
    updFilesAction && updFilesAction(user.apikey, files);
  };

  handleDelFilesAction = (files: IFile[]): void => {
    const { delFilesAction, user } = this.props;
    delFilesAction && delFilesAction(user.apikey, files);
  };

  handleFilesClearErrorAction = (): void => {
    const { filesClearErrorAction } = this.props;
    filesClearErrorAction && filesClearErrorAction();
  };

  state: IFilesState = {
    columns: [
      { title: "Name", field: "name", initialEditValue: "" },
      {
        title: "Тип",
        field: "type",
        initialEditValue: "",
        render: (rowData: IFile) => {
          return <FilesRowControlSelect apikey={this.props.user.apikey} rowData={rowData} />;
        },
      },
      {
        title: (
          <Button
            className={this.props.classes.getFiles}
            variant="outlined"
            color="primary"
            size="small"
            onClick={this.handleGetReportsAction}
          >
            {"Обновить"}
          </Button>
        ),
        field: "buttom",
        initialEditValue: "",
        sorting: false,
        render: (rowData: IFile) => (
          <FilesRowControlButton apikey={this.props.user.apikey} id={rowData.id} name={rowData.name} loaded={rowData.loaded} />
        ),
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

  render = (): JSX.Element => {
    const { files, errorText } = this.props;
    const { columns } = this.state;
    const { tableIcons } = this;

    return (
      <>
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
                const files: IFile[] = [
                  {
                    id: newData.id || "",
                    loaded: newData.loaded || false,
                    name: newData.name || "",
                    reportId: newData.reportId || "",
                    type: newData.type || 0,
                  },
                ];

                this.handleSetFilesAction(files);
                resolve();
              }),
            onRowUpdate: (newData: IFile, oldData: IFilesTable | undefined) =>
              new Promise((resolve, reject) => {
                const files: IFile[] = [
                  {
                    id: newData.id,
                    loaded: newData.loaded,
                    name: newData.name,
                    reportId: newData.reportId,
                    type: newData.type,
                  },
                ];

                this.handleUpdFilesAction(files);
                resolve();
              }),
            onRowDelete: (oldData: IFilesTable) =>
              new Promise((resolve, reject) => {
                if (!oldData || !oldData.tableData) {
                  resolve();
                  return;
                }

                const reports: IFile[] = [
                  {
                    id: oldData.id,
                    loaded: oldData.loaded,
                    name: oldData.name,
                    reportId: oldData.reportId,
                    type: oldData.type,
                  },
                ];

                this.handleDelFilesAction(reports);

                resolve();
              }),
          }}
        />
        {/** Обратная связь + */}
        <Snackbar open={!!errorText} autoHideDuration={3000} onClose={this.handleFilesClearErrorAction}>
          <MuiAlert elevation={6} variant="filled" severity="error" onClose={this.handleFilesClearErrorAction}>
            {errorText}
          </MuiAlert>
        </Snackbar>
        {/** Обратная связь - */}
      </>
    );
  };
}

const mapStateToProps = (state: IStore, ownProps: IFilesProps): IFilesProps => {
  const { user, files, router } = state;
  return {
    user: user,
    files: files.list,
    router: router,
    errorText: files.errorText,
    classes: ownProps.classes,
    getFilesAction: ownProps.getFilesAction,
    setFilesAction: ownProps.setFilesAction,
    updFilesAction: ownProps.updFilesAction,
    delFilesAction: ownProps.delFilesAction,
    filesClearErrorAction: ownProps.filesClearErrorAction,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<TAction>) => {
  return {
    getFilesAction: (apikey: string, reportId: string): void => {
      dispatch<IGetFilesAction>({
        type: GET_FILES,
        apikey: apikey,
        reportId: reportId,
      });
    },
    setFilesAction: (apikey: string, files: IFile[]): void => {
      dispatch<ISetFilesAction>({
        type: SET_FILES,
        apikey: apikey,
        list: files,
      });
    },
    updFilesAction: (apikey: string, files: IFile[]): void => {
      dispatch<IUpdFilesAction>({
        type: UPD_FILES,
        apikey: apikey,
        list: files,
      });
    },
    delFilesAction: (apikey: string, files: IFile[]): void => {
      dispatch<IDelFilesAction>({
        type: DEL_FILES,
        apikey: apikey,
        list: files,
      });
    },
    filesClearErrorAction: (): void => {
      dispatch<IFilesClearErrorAction>({
        type: FILES_CLEAR_ERROR,
      });
    },
  };
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Files));
