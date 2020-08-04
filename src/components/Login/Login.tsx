// react
import React, { Component } from "react";
// react-redux
import { connect } from "react-redux";
// interfaces
import IStore from "../../interfaces/IStore";
// components-material-ui
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
// classes-material-ui
import { createStyles, withStyles, WithStyles, Theme } from "@material-ui/core/styles";
import IUser from "../../interfaces/IUser";
import { Dispatch } from "redux";
import { ILoginAction, LOGIN, ILogoutAction, TAction, LOGOUT } from "../../types/TAction";
import Alert from "@material-ui/lab/Alert";
import { Snackbar } from "@material-ui/core";

// difination styling plan

type TStyleClasses = "root" | "rootLogin" | "rootPassword" | "grid";

let styles = (theme: Theme) =>
  createStyles<TStyleClasses, {}>({
    root: { flexGrow: 1 },
    rootLogin: { marginBottom: "8px" },
    rootPassword: { marginBottom: "16px" },
    grid: { minHeight: "70vh" },
  });

// own interfaces

interface ILoginProps extends WithStyles<typeof styles> {
  user?: IUser;
  loginAction?: (userLogin: string, userPassword: string) => void;
  logoutAction?: (apikey: string) => void;
}

export class Login extends Component<ILoginProps> {
  handleLoginAction = (): void => {
    const { loginAction } = this.props;

    const inputLoginNode = document.getElementById("input-login") as HTMLTextAreaElement;
    const inputPasswordNode = document.getElementById("input-password") as HTMLTextAreaElement;

    if (loginAction) {
      loginAction(inputLoginNode.value, inputPasswordNode.value);
    }
  };

  handleLogoutAction = (): void => {
    const { logoutAction, user } = this.props;

    if (!user) return;

    if (logoutAction) logoutAction(user.apikey);
  };

  render = () => {
    const { classes, user } = this.props;

    if (!user) return;
    if (user.apikey) {
      return (
        <div className={classes.root}>
          <Grid className={classes.grid} container spacing={0} direction="column" alignItems="center" justify="center">
            <Button variant="contained" color="secondary" onClick={this.handleLogoutAction}>
              Выйти
            </Button>
            {user.errorText && (
              <Snackbar open={!!user.errorText} autoHideDuration={6000}>
                <Alert severity="error">{user.errorText}</Alert>
              </Snackbar>
            )}
          </Grid>
        </div>
      );
    } else {
      return (
        <div className={classes.root}>
          <Grid className={classes.grid} container spacing={0} direction="column" alignItems="center" justify="center">
            {user.errorText ? (
              <TextField className={classes.rootLogin} error id="input-login" label="Логин" />
            ) : (
              <TextField className={classes.rootLogin} id="input-login" label="Логин" />
            )}
            {user.errorText ? (
              <TextField className={classes.rootPassword} error id="input-password" label="Пароль" type="password" />
            ) : (
              <TextField className={classes.rootPassword} id="input-password" label="Пароль" type="password" />
            )}
            <Button variant="contained" color="secondary" onClick={this.handleLoginAction}>
              Войти
            </Button>
            {user.errorText && (
              <Snackbar open={!!user.errorText} autoHideDuration={6000}>
                <Alert severity="error">{user.errorText}</Alert>
              </Snackbar>
            )}
          </Grid>
        </div>
      );
    }
  };
}

//<Link to={{ pathname: "/reports", search: "?sort=name", hash: "#the-hash", state: { fromDashboard: true } }}>123</Link>

const mapStateToProps = (state: IStore, ownProps: ILoginProps): ILoginProps => {
  const { user } = state;
  return {
    user: user,
    loginAction: ownProps.loginAction,
    logoutAction: ownProps.logoutAction,
    classes: ownProps.classes,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<TAction>) => {
  return {
    loginAction: (userLogin: string, userPassword: string): void => {
      dispatch<ILoginAction>({
        type: LOGIN,
        userLogin: userLogin,
        userPassword: userPassword,
      });
    },
    logoutAction: (apikey: string): void => {
      dispatch<ILogoutAction>({
        type: LOGOUT,
        apikey: apikey,
      });
    },
  };
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Login));
