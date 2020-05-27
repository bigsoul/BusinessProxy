import React, { Component } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { connect } from "react-redux";

function login() {
  const inputLogin = document.getElementById("input-login");
  const inputPassword = document.getElementById("input-password");

  let xhr = new XMLHttpRequest();

  let data = {
    login: inputLogin.value,
    password: inputPassword.value,
  };

  let body = JSON.stringify(data);

  xhr.open(
    "POST",
    "http://185.26.205.42:8086/do_demo/hs/BusinessProxy/LoginIn",
    true,
    "exchange",
    "exchange2016"
  );
  /*xhr.setRequestHeader(
      "Authorization",
      "Basic " + btoa("exchange:exchange2016")
    );*/
  xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
  xhr.setRequestHeader("Access-Control-Allow-Headers", "*");
  xhr.setRequestHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  //xhr.setRequestHeader("Authorization", "");
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.withCredentials = true;
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      const response = JSON.parse(xhr.response);
      if (response.apikey !== "") {
        response.loginState = { state: 1 };
      } else {
        response.loginState = { state: 2 };
      }
      window.store.dispatch({ type: "LOGIN", response: response });
    }
  };

  xhr.send(body);
}

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
