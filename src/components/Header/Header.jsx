import React, { Component } from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
//import { Theme } from "@material-ui/core/styles/createMuiTheme";
import MenuIcon from "@material-ui/icons/Menu";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";

function logout() {
  let xhr = new XMLHttpRequest();

  const state = window.store.getState();

  let data = { apikey: state.apikey };

  let body = JSON.stringify(data);

  xhr.open(
    "POST",
    "http://185.26.205.42:8086/do_demo/hs/BusinessProxy/LoginOut",
    true
  );

  xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
  xhr.setRequestHeader("Access-Control-Allow-Headers", "*");
  xhr.setRequestHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.withCredentials = false;

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      const response = JSON.parse(xhr.response);
      window.store.dispatch({ type: "LOGOUT", response: response });
    }
  };

  xhr.send(body);
}

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
}));

const PrimarySearchAppBar = (props) => {
  const classes = useStyles();

  return (
    <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="open drawer"
          >
            <MenuIcon />
          </IconButton>
          <Typography className={classes.title} variant="h6" noWrap>
            НЕОМЕТРИЯ
          </Typography>
          <div className={classes.grow} />
          {props.name === "" ? (
            ""
          ) : (
            <Typography
              variant="h6"
              component="h2"
              style={{ paddingRight: "10px" }}
            >
              {props.name}
            </Typography>
          )}
          {props.apikey === "" ? (
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

const mapStateToProps = (state, ownProps) => {
  return {
    apikey: state.apikey,
    name: state.name,
  };
};

export default connect(mapStateToProps)(PrimarySearchAppBar);
