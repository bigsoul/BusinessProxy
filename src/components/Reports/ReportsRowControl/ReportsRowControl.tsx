// react
import React, { Component } from "react";
// constants
import { IConfirmAction, CONFIRM } from "../../../interfaces/IAction";
// components-material-ui
import Button from "@material-ui/core/Button";
// classes-material-ui
import { createStyles, withStyles, WithStyles, Theme } from "@material-ui/core/styles";
import IUser from "../../../interfaces/IUser";

// difination styling plan

type TStyleClasses = "viewFiles" | "confirm";

const sourceStyles: Record<TStyleClasses, {}> = {
  viewFiles: { float: "right" },
  confirm: { float: "right", marginRight: "10px" },
};

let styles = (theme: Theme) => createStyles<TStyleClasses, {}>(sourceStyles);

// own interfaces

export interface IReportsRowControlProps extends WithStyles<typeof styles> {
  user: IUser;
  reportId: string;
  state: string;
}

export class ReportsRowControl extends Component<IReportsRowControlProps> {
  handleConfirm = () => {
    const { reportId, user } = this.props;
    window.store.dispatch<IConfirmAction>({
      type: CONFIRM,
      apikey: user.apikey,
      reportId: reportId,
    });
  };

  handleGetFilesAction = () => {
    const { reportId } = this.props;
    window._history.push(`${window.homepage}/files?reportId=${reportId}`);
  };

  render = (): JSX.Element | null => {
    const { state, classes } = this.props;

    return (
      <div>
        <Button className={classes.viewFiles} variant="outlined" size="small" color="primary" onClick={this.handleGetFilesAction}>
          {state === "Новый" ? "Просмотреть файлы" : "Изменить файлы"}
        </Button>
        {state === "Новый" && (
          <Button className={classes.confirm} variant="outlined" size="small" color="primary" onClick={this.handleConfirm}>
            {"Согласовать"}
          </Button>
        )}
      </div>
    );
  };
}

export default withStyles(styles)(ReportsRowControl);
