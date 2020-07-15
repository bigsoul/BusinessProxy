import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
//import { BrowserHistory } from "history";
import IApp from "../../interfaces/IApp";
import { Reducer } from "react";
import { TAction } from "../../types/TAction";

const createRootReducer = (history: any, appReducer: Reducer<IApp, TAction>) =>
  combineReducers({
    app: appReducer,
    router: connectRouter(history),
  });

export default createRootReducer;
