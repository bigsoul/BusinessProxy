// react
import React, { Component } from "react";
// components-material-ui
import Button from "@material-ui/core/Button";
// classes-material-ui
import { createStyles, withStyles, WithStyles, Theme } from "@material-ui/core/styles";

// difination styling plan

type TStyleClasses = "buttonTableCell" | "buttonAddReport";

let styles = (theme: Theme) =>
  createStyles<TStyleClasses, {}>({
    buttonTableCell: { float: "right" },
    buttonAddReport: { float: "right", marginRight: "10px" },
  });

// own interfaces

interface IContractsRowControlButtonProps extends WithStyles<typeof styles> {
  apikey: string;
  contractId: string;
}

export class ContractsRowControlButton extends Component<IContractsRowControlButtonProps> {
  handleGetReportsAction = (): void => {
    const { contractId } = this.props;
    window._history.push(`/reports?contractId=${contractId}`);
  };

  handleWizardReportsAction = (): void => {
    const { contractId } = this.props;
    window._history.push(`/reports/wizard?contractId=${contractId}`);
  };

  render = (): JSX.Element => {
    const { classes } = this.props;

    return (
      <>
        <Button
          className={classes["buttonTableCell"]}
          variant="outlined"
          size="small"
          color="primary"
          onClick={this.handleGetReportsAction}
        >
          {"Просмотреть отчеты"}
        </Button>
        <Button
          className={classes["buttonAddReport"]}
          variant="outlined"
          size="small"
          color="primary"
          onClick={this.handleWizardReportsAction}
        >
          {"Добавить отчет"}
        </Button>
      </>
    );
  };
}

export default withStyles(styles)(ContractsRowControlButton);
