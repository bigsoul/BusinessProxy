import React, { Component } from "react";
import {
  Button,
  withStyles,
  createStyles,
  Theme,
  WithStyles,
  Grid,
  Snackbar,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@material-ui/core";
import {
  IReportCurrentDelAction,
  REPORT_CURRENT_DEL,
  IReportAddSimplyAction,
  REPORT_ADD,
  IReportAddAction,
  REPORT_CURRENT_SET,
  WIZARD_SETUP_FILE,
  IWizardSetupFileAction,
  TAction,
} from "../../../types/TAction";
import IStore from "../../../interfaces/IStore";
import { connect } from "react-redux";
import CheckIcon from "@material-ui/icons/Check";
import { green } from "@material-ui/core/colors";
import { setReports, fileUpload, setFiles, conform } from "../../../classes/Requests";
import moment from "moment";
import MuiAlert from "@material-ui/lab/Alert";
import IFile from "../../../interfaces/IFile";
import IUser from "../../../interfaces/IUser";
import { RouterState } from "connected-react-router";
import { LocationState } from "history";
import { routerActions } from "react-router-redux";
import { Dispatch } from "redux";

// difination styling plan

type TStyleClasses = "backInConracts" | "grid" | "root" | "input" | "sendAndConfirm";

const sourceStyles: Record<TStyleClasses, {}> = {
  root: { "& > *": { float: "right", marginTop: "10px" } },
  input: { display: "none" },
  backInConracts: { marginTop: "10px", marginLeft: "10px" },
  sendAndConfirm: { marginTop: "30px" },
  grid: { minHeight: "70vh" },
};

let styles = (theme: Theme) => createStyles<TStyleClasses, {}>(sourceStyles);

// own interfaces

interface IWizardReportsProps extends WithStyles<typeof styles> {
  user: IUser;
  router: RouterState<LocationState>;
  contractId?: string;
  files?: [
    {
      fileType: number;
      file: File | null;
    }
  ];
  wizardSetupFileAction?: (fileType: number, id: string, file: File | null) => void;
}

class WizardReports extends Component<IWizardReportsProps> {
  file10: FileList | null = null;
  file20: FileList | null = null;
  file30: FileList | null = null;

  file10Id: string = "";
  file20Id: string = "";
  file30Id: string = "";

  contractId: string = "";
  reportId: string = "";

  state = {
    openAlertError: false,
    textAlertError: "",
    reportCreated: false,
  };

  hendleCloseAlertError = () => {
    this.setState({ openAlertError: false });
  };

  hendleSendReport = () => {
    if (!this.file10 || (this.file10 && this.file10.length === 0)) {
      this.setState({ openAlertError: true, textAlertError: "Ошибка. Не выбран файл отчета КС2." });
      return;
    }
    if (!this.file20 || (this.file20 && this.file20.length === 0)) {
      this.setState({ openAlertError: true, textAlertError: "Ошибка. Не выбран файл отчета КС3." });
      return;
    }
    if (!this.file30 || (this.file30 && this.file30.length === 0)) {
      this.setState({ openAlertError: true, textAlertError: "Ошибка. Не выбран файл отчета исп. документации." });
      return;
    }

    setReports("", this.contractId, "Отчет от " + moment().format().substr(0, 10), "Новый", this.collbeckReportCreated);
  };

  collbeckReportCreated = (response: any) => {
    if (response) {
      this.reportId = response[0].id;

      setFiles("", this.contractId, this.reportId, this.file10 ? this.file10[0].name : "", 10, this.collbeckFileCreated10);
      setFiles("", this.contractId, this.reportId, this.file20 ? this.file20[0].name : "", 20, this.collbeckFileCreated20);
      setFiles("", this.contractId, this.reportId, this.file30 ? this.file30[0].name : "", 30, this.collbeckFileCreated30);
    } else {
      this.setState({ openAlertError: true, textAlertError: "Ошибка создания отчета на сервере. Попробуйте обновить страницу." });
    }
  };

  collbeckFileCreated10 = (response: IFile[]) => {
    if (this.file10 && this.file10[0]) {
      fileUpload(this.file10, response[0], this.contractId, true, this.collbeckFileUploaded);
      this.file10Id = response[0].id;
    }
  };

  collbeckFileCreated20 = (response: IFile[]) => {
    if (this.file20 && this.file20[0]) {
      fileUpload(this.file20, response[0], this.contractId, true, this.collbeckFileUploaded);
      this.file20Id = response[0].id;
    }
  };

  collbeckFileCreated30 = (response: IFile[]) => {
    if (this.file30 && this.file30[0]) {
      fileUpload(this.file30, response[0], this.contractId, true, this.collbeckFileUploaded);
      this.file30Id = response[0].id;
    }
  };

  collbeckFileUploaded = (response: IFile[]) => {
    if (this.file10Id !== "" && this.file20Id !== "" && this.file30Id !== "") {
      this.file10 = null;
      this.file20 = null;
      this.file30 = null;

      this.file10Id = "";
      this.file20Id = "";
      this.file30Id = "";

      conform(this.reportId, true);

      this.setState({ reportCreated: true });
    }
  };

  handleFileUploadOnChange = (fileType: number) => {
    const inputNode = document.getElementById("upload-" + fileType) as HTMLInputElement;

    if (inputNode.files && inputNode.files.length > 0) {
      switch (fileType) {
        case 10: {
          this.file10 = { ...inputNode.files };
          break;
        }
        case 20: {
          this.file20 = { ...inputNode.files };
          break;
        }
        case 30: {
          this.file30 = { ...inputNode.files };
          break;
        }
        default:
          console.log("Попытка загрузить неизвестный тип файла.");
      }

      inputNode.value = "";

      this.setState({});
    }
  };

  render = () => {
    const { classes } = this.props;

    if (this.state.reportCreated) {
      return <ResponsiveDialog contractId={this.contractId} />;
    } else {
      return (
        <>
          {/** Обратная связь + */}
          <Snackbar open={this.state.openAlertError} autoHideDuration={3000} onClose={this.hendleCloseAlertError}>
            <MuiAlert elevation={6} variant="filled" severity="error" onClose={this.hendleCloseAlertError}>
              {this.state.textAlertError}
            </MuiAlert>
          </Snackbar>
          {/** Обратная связь - */}
          <Grid className={classes.grid} container spacing={0} direction="column" alignItems="center" justify="center">
            <div className={classes.root}>
              <input
                accept="*"
                className={classes.input}
                id={"upload-10"}
                multiple
                type="file"
                onChange={() => this.handleFileUploadOnChange(10)}
              />
              <label htmlFor={"upload-10"}>
                <Button variant="outlined" color="primary" component="span" size="small">
                  {"Загрузить оригинал КС2 "}
                  {this.file10 === null ? "" : <CheckIcon style={{ color: green[500] }} />}
                </Button>
              </label>
            </div>
            <div className={classes.root}>
              <input
                accept="*"
                className={classes.input}
                id={"upload-20"}
                multiple
                type="file"
                onChange={() => this.handleFileUploadOnChange(20)}
              />
              <label htmlFor={"upload-20"}>
                <Button variant="outlined" color="primary" component="span" size="small">
                  {"Загрузить оригинал КС3 "}
                  {this.file20 === null ? "" : <CheckIcon style={{ color: green[500] }} />}
                </Button>
              </label>
            </div>
            <div className={classes.root}>
              <input
                accept="*"
                className={classes.input}
                id={"upload-30"}
                multiple
                type="file"
                onChange={() => this.handleFileUploadOnChange(30)}
              />
              <label htmlFor={"upload-30"}>
                <Button variant="outlined" color="primary" component="span" size="small">
                  {"Загрузить исп. документацию "}
                  {this.file30 === null ? "" : <CheckIcon style={{ color: green[500] }} />}
                </Button>
              </label>
            </div>
            <Button className={classes.sendAndConfirm} variant="outlined" color="secondary" size="small" onClick={this.hendleSendReport}>
              {"Отправить и согласовать"}
            </Button>
          </Grid>
        </>
      );
    }
  };
}

const ResponsiveDialog = (props: { contractId: string }) => {
  const [open, setOpen] = React.useState(true);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleClose = () => {
    setOpen(false);
    //window.store.dispatch<IReportCurrentSetAction>({ type: REPORT_CURRENT_SET, contractId: props.contractId });
  };

  return (
    <div>
      <Dialog fullScreen={fullScreen} open={open} onClose={handleClose} aria-labelledby="responsive-dialog-title">
        <DialogTitle id="responsive-dialog-title">{"Отчет создан"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Отчет успешно создан и отправлен на согласование. Вы можете найти его в списке отчетов и отслеживать статус согласования.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            Ок, понятно
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const mapStateToProps = (state: IStore, ownProps: IWizardReportsProps): IWizardReportsProps => {
  const { user, router, reports } = state;
  return {
    user: user,
    router: router,
    contractId: reports.wizard.contractId,
    files: reports.wizard.files,
    classes: ownProps.classes,
    wizardSetupFileAction: ownProps.wizardSetupFileAction,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<TAction>) => {
  return {
    wizardSetupFileAction: (fileType: number, file: File | null): void => {
      dispatch<IWizardSetupFileAction>({
        type: WIZARD_SETUP_FILE,
        fileType: fileType,
        file: file,
      });
    },
  };
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(WizardReports));
