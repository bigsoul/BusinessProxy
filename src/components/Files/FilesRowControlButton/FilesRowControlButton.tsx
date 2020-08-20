// react
import React, { Component } from "react";
// components-material-ui
import Button from "@material-ui/core/Button";
// classes-material-ui
import { createStyles, withStyles, WithStyles, Theme } from "@material-ui/core/styles";
import { IFileUploadAction, FILE_UPLOAD } from "../../../types/TAction";
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
  apikey: string;
  id: string;
  name: string;
  loaded: boolean;
}

export class FilesRowControlButton extends Component<IFilesRowControlButtonProps> {
  handleFileUploadAction = (): void => {
    const { apikey, id, name } = this.props;

    const inputNode = document.getElementById("upload-" + id) as HTMLInputElement;

    if (inputNode.files && inputNode.files.length > 0) {
      const file = inputNode.files[0];

      window.store.dispatch<IFileUploadAction>({
        type: FILE_UPLOAD,
        apikey: apikey,
        id: id,
        name: name,
        file: file,
      });
    }

    inputNode.value = "";
  };

  handleFileDownloadAction = (): void => {};

  render = (): JSX.Element => {
    const { classes, id, loaded } = this.props;

    return (
      <div>
        {loaded ? (
          <Button className={classes.ButtonLoadedOriginal} variant="outlined" size="small" onClick={this.handleFileDownloadAction}>
            {"Скачать"}
          </Button>
        ) : (
          <div className={classes.root}>
            <input accept="*" className={classes.input} id={"upload-" + id} multiple type="file" onChange={this.handleFileUploadAction} />
            <label htmlFor={"upload-" + id}>
              <Button variant="outlined" color="primary" component="span" size="small">
                {"Загрузить"}
              </Button>
            </label>
          </div>
        )}
      </div>
    );
  };
}

export default withStyles(styles)(FilesRowControlButton);
