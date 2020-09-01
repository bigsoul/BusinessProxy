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
import store from "./classes/configureStore";

const { contracts, reports, files, router } = store.getState();

const user = { apikey: "", name: "", isLoading: false, errorText: "" };

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
