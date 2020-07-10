// react
import React, { Component } from "react";
// interfaces
import IFile from "../../../interfaces/IFile";
// classes
import { fileUpload, fileDownload } from "../../../classes/Requests";
// components-material-ui
import Button from "@material-ui/core/Button";
// classes-material-ui
import { createStyles, withStyles, WithStyles, Theme } from "@material-ui/core/styles";

// difination styling plan

type TStyleClasses = "root" | "input" | "formControl" | "selectEmpty" | "ButtonLoadedDraft" | "ButtonLoadedOriginal";

let styles = (theme: Theme) =>
  createStyles<TStyleClasses, {}>({
    root: { "& > *": { float: "right", marginRight: "10px" } },
    input: { display: "none" },
    formControl: { margin: theme.spacing(1), minWidth: 120 },
    selectEmpty: { marginTop: theme.spacing(2) },
    ButtonLoadedDraft: { float: "right", marginRight: "10px" },
    ButtonLoadedOriginal: { float: "right" },
  });

// own interfaces

interface IFilesRowControlButtonProps extends WithStyles<typeof styles> {
  rowData: IFile;
  contractId: string;
}

export class FilesRowControlButton extends Component<IFilesRowControlButtonProps> {
  handleFileUploadOnChange = (rowData: IFile, contractId: string, isOriginal: boolean): void => {
    const inputNode = document.getElementById("upload-" + rowData.id) as HTMLInputElement;

    if (inputNode.files && inputNode.files.length > 0) {
      fileUpload(inputNode.files, rowData, contractId, isOriginal);
      inputNode.value = "";
    }
  };

  render = (): JSX.Element => {
    const { classes, rowData, contractId } = this.props;

    return (
      <div>
        {rowData.loadedOriginal ? (
          <Button className={classes.ButtonLoadedOriginal} variant="outlined" size="small" onClick={(e) => fileDownload(rowData)}>
            {"Скачать оригинал"}
          </Button>
        ) : (
          <div className={classes.root}>
            <input
              accept="*"
              className={classes.input}
              id={"upload-" + rowData.id}
              multiple
              type="file"
              onChange={() => this.handleFileUploadOnChange(rowData, contractId, true)}
            />
            <label htmlFor={"upload-" + rowData.id}>
              <Button variant="outlined" color="primary" component="span" size="small">
                {"Загрузить оригинал"}
              </Button>
            </label>
          </div>
        )}
        {rowData.loadedDraft ? (
          <Button className={classes.ButtonLoadedDraft} variant="outlined" size="small" onClick={(e) => fileDownload(rowData)}>
            {"Скачать черновик"}
          </Button>
        ) : (
          <div className={classes.root}>
            <input
              accept="*"
              className={classes.input}
              id={"upload-" + rowData.id}
              multiple
              type="file"
              onChange={() => this.handleFileUploadOnChange(rowData, contractId, false)}
            />
            <label htmlFor={"upload-" + rowData.id}>
              <Button variant="outlined" color="primary" component="span" size="small">
                {"Загрузить черновик"}
              </Button>
            </label>
          </div>
        )}
      </div>
    );
  };
}

export default withStyles(styles)(FilesRowControlButton);
