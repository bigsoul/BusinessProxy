// react
import React, { Component } from "react";
// constants
import { FILE_CURRENT_SET, IFileCurrentSetAction } from "./../../../types/TAction";
// interfaces
import IReport from "../../../interfaces/IReport";
// classes
import { conform } from "../../../classes/Requests";
// components-material-ui
import Button from "@material-ui/core/Button";
// classes-material-ui
import { createStyles, withStyles, WithStyles, Theme } from "@material-ui/core/styles";

// difination styling plan

type TStyleClasses = "b1" | "b2";

const sourceStyles: Record<TStyleClasses, {}> = {
  b1: { float: "right" },
  b2: { float: "right", marginRight: "10px" },
};

let styles = (theme: Theme) => createStyles<TStyleClasses, {}>(sourceStyles);

// own interfaces

export interface IReportsRowControlProps extends WithStyles<typeof styles> {
  rowData: IReport;
}

export class ReportsRowControl extends Component<IReportsRowControlProps> {
  handleReportOnClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, rowData: IReport) => {
    e.stopPropagation();

    window.store.dispatch<IFileCurrentSetAction>({
      type: FILE_CURRENT_SET,
      contractId: rowData.contractId,
      reportId: rowData.id,
    });
  };

  render = (): JSX.Element => {
    const { rowData, classes } = this.props;

    if (rowData && rowData.state === "Новый") {
      return (
        <div>
          <Button className={classes.b1} variant="outlined" size="small" color="primary" onClick={(): void => conform(rowData.id, true)}>
            {"Согласовать оригинал"}
          </Button>
          <Button className={classes.b2} variant="outlined" size="small" color="primary" onClick={(): void => conform(rowData.id, false)}>
            {"Согласовать черновик"}
          </Button>
          <Button
            className={classes.b2}
            variant="outlined"
            size="small"
            color="primary"
            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => this.handleReportOnClick(e, rowData)}
          >
            {"Изменить файлы"}
          </Button>
        </div>
      );
    } else if (rowData && rowData.state === "К регистрации") {
      return (
        <div>
          <Button className={classes.b1} variant="outlined" size="small" color="primary" onClick={(): void => conform(rowData.id, true)}>
            {"Согласовать оригинал"}
          </Button>
          <Button
            className={classes.b2}
            variant="outlined"
            size="small"
            color="primary"
            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => this.handleReportOnClick(e, rowData)}
          >
            {"Изменить файлы"}
          </Button>
        </div>
      );
    } else if (rowData) {
      return (
        <Button
          className={classes.b1}
          variant="outlined"
          size="small"
          color="primary"
          onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => this.handleReportOnClick(e, rowData)}
        >
          {"Просмотреть файлы"}
        </Button>
      );
    } else return <></>;
  };
}

export default withStyles(styles)(ReportsRowControl);
