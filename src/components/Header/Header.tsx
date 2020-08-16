// react
import React, { Component } from "react";
// react-redux
import { connect } from "react-redux";
// interfaces
import IStore from "../../interfaces/IStore";
import IUser from "../../interfaces/IUser";
// components-material-ui
import MenuIcon from "@material-ui/icons/Menu";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
// classes-material-ui
import { createStyles, withStyles, WithStyles, Theme } from "@material-ui/core/styles";
import { ILogoutAction, LOGOUT } from "../../types/TAction";
import { Dispatch } from "redux";

// difination styling plan

type TStyleClasses = "grow" | "menuButton" | "title" | "typography";

let styles = (theme: Theme) =>
  createStyles<TStyleClasses, {}>({
    grow: { flexGrow: 1 },
    menuButton: { marginRight: theme.spacing(2) },
    title: { display: "none", [theme.breakpoints.up("sm")]: { display: "block" }, cursor: "pointer" },
    typography: { paddingRight: "10px" },
  });

// own interfaces

interface IHeaderProps extends WithStyles<typeof styles> {
  user: IUser;
  logoutAction?: (apikey: string) => void;
}

export class Header extends Component<IHeaderProps> {
  handleLogoutAction = (): void => {
    const { logoutAction, user } = this.props;

    if (logoutAction) logoutAction(user.apikey);
  };

  hendleGetContractsAction = (): void => {
    window._history.push(`${window.homepage}/contracts`);
  };

  render = () => {
    const { classes, user } = this.props;

    return (
      <div className={classes.grow}>
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="open drawer">
              <MenuIcon />
            </IconButton>
            <Typography className={classes.title} variant="h6" noWrap onClick={this.hendleGetContractsAction}>
              НЕОМЕТРИЯ
            </Typography>
            <div className={classes.grow} />
            {user.name === "" ? (
              ""
            ) : (
              <Typography className={classes.typography} variant="h6" component="h2">
                {user.name}
              </Typography>
            )}
            {user.apikey === "" ? (
              ""
            ) : (
              <Button variant="contained" color="secondary" onClick={this.handleLogoutAction}>
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
  const { user } = state;
  return {
    user: user,
    logoutAction: ownProps.logoutAction,
    classes: ownProps.classes,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<ILogoutAction>) => {
  return {
    logoutAction: (apikey: string): void => {
      dispatch<ILogoutAction>({
        type: LOGOUT,
        apikey: apikey,
      });
    },
  };
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Header));
