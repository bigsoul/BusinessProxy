// react
import React, { Component } from "react";
// react-redux
import { connect } from "react-redux";
// interfaces
import IStore from "../../interfaces/IStore";
// classes
import { logout } from "../../classes/Requests";
// components-material-ui
import MenuIcon from "@material-ui/icons/Menu";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
// classes-material-ui
import { createStyles, withStyles, WithStyles, Theme } from "@material-ui/core/styles";

// difination styling plan

type TStyleClasses = "grow" | "menuButton" | "title" | "typography";

let styles = (theme: Theme) =>
  createStyles<TStyleClasses, {}>({
    grow: { flexGrow: 1 },
    menuButton: { marginRight: theme.spacing(2) },
    title: { display: "none", [theme.breakpoints.up("sm")]: { display: "block" } },
    typography: { paddingRight: "10px" },
  });

// own interfaces

interface IHeaderProps extends WithStyles<typeof styles> {
  apikey: string;
  name: string;
}

export class Header extends Component<IHeaderProps> {
  render = () => {
    const { classes, apikey, name } = this.props;

    return (
      <div className={classes.grow}>
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="open drawer">
              <MenuIcon />
            </IconButton>
            <Typography className={classes.title} variant="h6" noWrap>
              НЕОМЕТРИЯ
            </Typography>
            <div className={classes.grow} />
            {name === "" ? (
              ""
            ) : (
              <Typography className={classes.typography} variant="h6" component="h2">
                {name}
              </Typography>
            )}
            {apikey === "" ? (
              ""
            ) : (
              <Button variant="contained" color="secondary" onClick={logout}>
                Выйти
              </Button>
            )}
          </Toolbar>
        </AppBar>
      </div>
    );
  };
}

const mapStateToProps = (state: IStore, ownProps: IHeaderProps): IHeaderProps => {
  return {
    apikey: state.apikey,
    name: state.name,
    classes: ownProps.classes,
  };
};

export default withStyles(styles)(connect(mapStateToProps)(Header));
