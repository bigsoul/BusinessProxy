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
  WIZARD_SETUP_FILE,
  IWizardSetupFileAction,
  TAction,
  IWizardConfirmAction,
  WIZARD_CONFIRM,
  WIZARD_SETUP_CONTRACT_ID,
  IWizardSetupContractIdAction,
  IWizardClearErrorAction,
  WIZARD_CLEAR_ERROR,
} from "../../../types/TAction";
import IStore from "../../../interfaces/IStore";
import { connect } from "react-redux";
import CheckIcon from "@material-ui/icons/Check";
import { green } from "@material-ui/core/colors";
import MuiAlert from "@material-ui/lab/Alert";
import IUser from "../../../interfaces/IUser";
import { RouterState } from "connected-react-router";
import { LocationState } from "history";
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
  file10?: File | null;
  file20?: File | null;
  file30?: File | null;
  errorText?: string;
  saccess?: boolean;
  wizardSetupContractIdAction?: (contractId: string) => void;
  wizardSetupFileAction?: (fileType: number, file: File | null) => void;
  wizardConfirmAction?: (apikey: string, contractId: string, file10: File | null, file20: File | null, file30: File | null) => void;
  wizardClearErrorAction?: () => void;
}

class WizardReports extends Component<IWizardReportsProps> {
  componentDidMount = () => {
    const { wizardSetupContractIdAction, router } = this.props;
    const contractId = (router.location as any).query["contractId"];
    wizardSetupContractIdAction && wizardSetupContractIdAction(contractId);
  };

  handleWizardSetupFileAction = (fileType: number) => {
    const inputNode = document.getElementById("upload-" + fileType) as HTMLInputElement;
    const { wizardSetupFileAction } = this.props;

    wizardSetupFileAction && wizardSetupFileAction(fileType, inputNode.files && inputNode.files[0]);

    inputNode.value = "";
  };

  handleWizardConfirmAction = () => {
    const { wizardConfirmAction, user, contractId, file10, file20, file30 } = this.props;
    wizardConfirmAction &&
      wizardConfirmAction(
        user.apikey,
        contractId ? contractId : "",
        file10 ? file10 : null,
        file20 ? file20 : null,
        file30 ? file30 : null
      );
  };

  handleWizardClearErrorAction = () => {
    const { wizardClearErrorAction } = this.props;
    wizardClearErrorAction && wizardClearErrorAction();
  };

  render = () => {
    const { classes, file10, file20, file30, errorText, contractId, saccess } = this.props;

    if (saccess) {
      return <ResponsiveDialog contractId={contractId ? contractId : ""} />;
    } else {
      return (
        <>
          {/** Обратная связь + */}
          <Snackbar open={!!errorText} autoHideDuration={3000} onClose={this.handleWizardClearErrorAction}>
            <MuiAlert elevation={6} variant="filled" severity="error" onClose={this.handleWizardClearErrorAction}>
              {errorText}
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
                onChange={() => this.handleWizardSetupFileAction(10)}
              />
              <label htmlFor={"upload-10"}>
                <Button variant="outlined" color="primary" component="span" size="small">
                  {"Загрузить оригинал КС2 "}
                  {!file10 ? "" : <CheckIcon style={{ color: green[500] }} />}
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
                onChange={() => this.handleWizardSetupFileAction(20)}
              />
              <label htmlFor={"upload-20"}>
                <Button variant="outlined" color="primary" component="span" size="small">
                  {"Загрузить оригинал КС3 "}
                  {!file20 ? "" : <CheckIcon style={{ color: green[500] }} />}
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
                onChange={() => this.handleWizardSetupFileAction(30)}
              />
              <label htmlFor={"upload-30"}>
                <Button variant="outlined" color="primary" component="span" size="small">
                  {"Загрузить исп. документацию "}
                  {!file30 ? "" : <CheckIcon style={{ color: green[500] }} />}
                </Button>
              </label>
            </div>
            <Button
              className={classes.sendAndConfirm}
              variant="outlined"
              color="secondary"
              size="small"
              onClick={this.handleWizardConfirmAction}
            >
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
    window._history.push(`${window.homepage}/reports?contractId=${props.contractId}`);
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
    file10: reports.wizard.file10,
    file20: reports.wizard.file20,
    file30: reports.wizard.file30,
    errorText: reports.wizard.errorText,
    classes: ownProps.classes,
    saccess: reports.wizard.saccess,
    wizardSetupContractIdAction: ownProps.wizardSetupContractIdAction,
    wizardSetupFileAction: ownProps.wizardSetupFileAction,
    wizardConfirmAction: ownProps.wizardConfirmAction,
    wizardClearErrorAction: ownProps.wizardClearErrorAction,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<TAction>) => {
  return {
    wizardSetupContractIdAction: (contractId: string): void => {
      dispatch<IWizardSetupContractIdAction>({
        type: WIZARD_SETUP_CONTRACT_ID,
        contractId: contractId,
      });
    },
    wizardSetupFileAction: (fileType: number, file: File | null): void => {
      dispatch<IWizardSetupFileAction>({
        type: WIZARD_SETUP_FILE,
        fileType: fileType,
        file: file,
      });
    },
    wizardConfirmAction: (apikey: string, contractId: string, file10: File | null, file20: File | null, file30: File | null): void => {
      dispatch<IWizardConfirmAction>({
        type: WIZARD_CONFIRM,
        contractId: contractId,
        apikey: apikey,
        file10: file10,
        file20: file20,
        file30: file30,
      });
    },
    wizardClearErrorAction: (): void => {
      dispatch<IWizardClearErrorAction>({
        type: WIZARD_CLEAR_ERROR,
      });
    },
  };
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(WizardReports));
