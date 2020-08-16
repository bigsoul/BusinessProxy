/// <reference path="./globals.d.ts" />

// css
import "./index.css";
// theme
import theme from "./themes/theme";
// react
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
// components-material-ui
import { ThemeProvider } from "@material-ui/core/styles";
// components
import App from "./App";
// others
import "typeface-roboto";

import { ConnectedRouter } from "connected-react-router";

import { history } from "./classes/reducers/routerReducer";
import configureStore from "./classes/configureStore";

const store = configureStore();

window.store = store;
window._history = history;

const { contracts, reports, files, router } = store.getState();

const user = { apikey: "", name: "", isLoading: false, errorText: "" };

console.log(window.location);

const serviceUrl = "";
const serviceLogin = "";
const servicePassword = "";

ReactDOM.render(
  <>
    {/*<React.StrictMode>*/}

    <Provider store={store}>
      <ConnectedRouter history={history}>
        <ThemeProvider theme={theme}>
          <App user={user} contracts={contracts.list} reports={reports.table.list} files={files.list} router={router} />
        </ThemeProvider>
      </ConnectedRouter>
    </Provider>

    {/*</React.StrictMode>*/}
  </>,
  document.getElementById("root")
);
