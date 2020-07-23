import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
//import { BrowserHistory } from "history";
import IApp from "../../interfaces/IApp";
import { Reducer } from "react";
import { TAction } from "../../types/TAction";
import userReducer from "./userReducer";
import routerReducer from "./routerReducer";
import contractsReducer from "./contractsReducer";
import reportsReducer from "./reports";

const createRootReducer = () =>
  combineReducers({
    user: userReducer,
    contracts: contractsReducer,
    reports: combineReducers({
      list: reportsReducer,
    }),
    router: routerReducer,
  });

export default createRootReducer;
