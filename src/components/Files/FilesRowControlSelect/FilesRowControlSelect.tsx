// react
import React, { Component } from "react";
// interfaces
import IFile from "../../../interfaces/IFile";
// components-material-ui
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
// classes
import { updFiles } from "../../../classes/Requests";
// classes-material-ui
import { createStyles, withStyles, WithStyles, Theme } from "@material-ui/core/styles";

// difination styling plan

type TStyleClasses = "formControl" | "select";

const sourceStyles: Record<TStyleClasses, {}> = {
  formControl: { minWidth: "120px" },
  select: { minWidth: "120px" },
};

let styles = (theme: Theme) => createStyles<TStyleClasses, {}>(sourceStyles);

// own interfaces

interface IFilesRowControlSelectProps extends WithStyles<typeof styles> {
  rowData: IFile;
  contractId: string;
}

export class FilesRowControlSelect extends Component<IFilesRowControlSelectProps> {
  handleChange = (
    event: React.ChangeEvent<{
      name?: string;
      value: unknown;
    }>
  ) => {
    const { rowData, contractId } = this.props;
    updFiles(rowData.id, contractId, rowData.reportId, rowData.name, event.target.value as number);
  };

  render = (): JSX.Element => {
    const { classes } = this.props;
    const { type } = this.props.rowData;

    return (
      <FormControl className={classes.formControl}>
        <Select
          className={classes.select}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={type ? type : 0}
          onChange={this.handleChange}
        >
          <MenuItem value={0}>выберите тип документа ...</MenuItem>
          <MenuItem value={10}>Акт о приемке выполненых работ КС2</MenuItem>
          <MenuItem value={20}>Справка о стоимости выполненных работ КС3</MenuItem>
          <MenuItem value={30}>Исполнительная документация</MenuItem>
        </Select>
      </FormControl>
    );
  };
}

export default withStyles(styles)(FilesRowControlSelect);
