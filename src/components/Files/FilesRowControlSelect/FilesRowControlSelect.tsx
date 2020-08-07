// react
import React, { Component } from "react";
// interfaces
import IFile from "../../../interfaces/IFile";
// components-material-ui
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
// classes-material-ui
import { createStyles, withStyles, WithStyles, Theme } from "@material-ui/core/styles";
import { UPD_FILES, IUpdFilesAction } from "../../../types/TAction";

// difination styling plan

type TStyleClasses = "formControl" | "select";

const sourceStyles: Record<TStyleClasses, {}> = {
  formControl: { minWidth: "120px" },
  select: { minWidth: "120px" },
};

let styles = (theme: Theme) => createStyles<TStyleClasses, {}>(sourceStyles);

// own interfaces

interface IFilesRowControlSelectProps extends WithStyles<typeof styles> {
  apikey: string;
  rowData: IFile;
}

export class FilesRowControlSelect extends Component<IFilesRowControlSelectProps> {
  handleChange = (
    event: React.ChangeEvent<{
      name?: string;
      value: unknown;
    }>
  ) => {
    const { apikey, rowData } = this.props;

    const row = { ...rowData };
    row.type = event.target.value as number;
    delete (row as any).tableData;

    window.store.dispatch<IUpdFilesAction>({
      type: UPD_FILES,
      apikey: apikey,
      list: [row],
    });
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
