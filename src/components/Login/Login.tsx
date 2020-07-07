// react
import React, { Component } from "react";
// react-redux
import { connect } from "react-redux";
// interfaces
import IStore from "../../interfaces/IStore";
import ILoginState from "../../interfaces/ILoginState";
// classes
import { login } from "../../classes/Requests";
// components-material-ui
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
// classes-material-ui
import { createStyles, withStyles, WithStyles, Theme } from "@material-ui/core/styles";
import { Link } from "react-router-dom";

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
  loginState: ILoginState;
}

export class Login extends Component<ILoginProps> {
  handleLoginOnClick = (): void => {
    const inputLoginNode = document.getElementById("input-login") as HTMLTextAreaElement;
    const inputPasswordNode = document.getElementById("input-password") as HTMLTextAreaElement;

    login(inputLoginNode.value, inputPasswordNode.value);
    window.history.pushState(null, "", "/#/contracts");
  };

  render = () => {
    const { classes, loginState } = this.props;

    return (
      <div className={classes.root}>
        <Grid className={classes.grid} container spacing={0} direction="column" alignItems="center" justify="center">
          {loginState.state === 2 ? (
            <TextField error className={classes.rootLogin} id="input-login" label="Логин" />
          ) : (
            <TextField className={classes.rootLogin} id="input-login" label="Логин" />
          )}
          {loginState.state === 2 ? (
            <TextField
              error
              className={classes.rootPassword}
              id="input-password"
              label="Пароль"
              type="password"
              helperText="Не верный логин или пароль."
            />
          ) : (
            <TextField className={classes.rootPassword} id="input-password" label="Пароль" type="password" />
          )}
          <Button variant="contained" color="secondary" onClick={this.handleLoginOnClick}>
            Войти
          </Button>
          <Link to={{ pathname: "/reports", search: "?sort=name", hash: "#the-hash", state: { fromDashboard: true } }}>123</Link>
        </Grid>
      </div>
    );
  };
}

const mapStateToProps = (state: IStore, ownProps: ILoginProps): ILoginProps => {
  const { app } = state;
  return {
    loginState: app.loginState,
    classes: ownProps.classes,
  };
};

export default withStyles(styles)(connect(mapStateToProps)(Login));
