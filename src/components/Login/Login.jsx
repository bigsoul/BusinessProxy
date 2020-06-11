import React, { Component } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { connect } from "react-redux";
import { login } from "../../classes/Requests";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  rootLogin: {
    marginBottom: "8px",
  },
  rootPassword: {
    marginBottom: "16px",
  },
}));

const Login = (props) => {
  const classes = useStyles();
  const state = props.loginState.state;

  return (
    <div className={classes.root}>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ minHeight: "70vh" }}
      >
        {state === 2 ? (
          <TextField
            error
            id="input-login"
            label="Логин"
            className={classes.rootLogin}
          />
        ) : (
          <TextField
            id="input-login"
            label="Логин"
            className={classes.rootLogin}
          />
        )}
        {state === 2 ? (
          <TextField
            error
            id="input-password"
            label="Пароль"
            type="password"
            className={classes.rootPassword}
            helperText="Не верный логин или пароль."
          />
        ) : (
          <TextField
            id="input-password"
            label="Пароль"
            type="password"
            className={classes.rootPassword}
          />
        )}
        <Button variant="contained" color="secondary" onClick={login}>
          Войти
        </Button>
      </Grid>
    </div>
  );
};

const mapStateToProps = (state, ownProps) => {
  return {
    loginState: state.loginState,
  };
};

export default connect(mapStateToProps)(Login);
