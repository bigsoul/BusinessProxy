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

import { appReducer, appPreloadedState } from "./classes/reducers/appReducer";
import configureStore, { history } from "./classes/configureStore";

const preloadedState = { app: appPreloadedState() };

const store: any = configureStore(preloadedState, appReducer);

window.store = store;
window._history = history;

ReactDOM.render(
  <>
    {/*<React.StrictMode>*/}

    <Provider store={store}>
      <ConnectedRouter history={history}>
        <ThemeProvider theme={theme}>
          <App
            apikey={""}
            name={""}
            loginState={{ state: 0 }}
            path={""}
            files={[]}
            reportId={""}
            reports={[]}
            contractId={""}
            contracts={store.getState().app.contracts}
          />
        </ThemeProvider>
      </ConnectedRouter>
    </Provider>

    {/*</React.StrictMode>*/}
  </>,
  document.getElementById("root")
);

/*ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <ThemeProvider theme={theme}>
          <App
            apikey={""}
            name={""}
            loginState={{ state: 0 }}
            files={[]}
            reportId={""}
            reports={[]}
            contractId={""}
            contracts={store.getState().app.contracts}
          />
        </ThemeProvider>
      </ConnectedRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);*/
