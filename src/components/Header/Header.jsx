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

import { logout } from "../../classes/Requests";

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
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="open drawer">
            <MenuIcon />
          </IconButton>
          <Typography className={classes.title} variant="h6" noWrap>
            НЕОМЕТРИЯ
          </Typography>
          <div className={classes.grow} />
          {props.name === "" ? (
            ""
          ) : (
            <Typography variant="h6" component="h2" style={{ paddingRight: "10px" }}>
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
