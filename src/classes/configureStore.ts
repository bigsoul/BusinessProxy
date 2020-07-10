import { createBrowserHistory } from "history";
import { applyMiddleware, compose, createStore } from "redux";
import { routerMiddleware } from "connected-react-router";
import createRootReducer from "./reducers";
import IApp from "../interfaces/IApp";
import { Reducer } from "react";
import { TAction } from "../types/TAction";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";

export const history = createBrowserHistory();

const configureStore = (preloadedState: any, appReducer: Reducer<IApp, TAction>) =>
  createStore(
    createRootReducer(history, appReducer),
    preloadedState,
    composeWithDevTools(applyMiddleware(thunk, routerMiddleware(history)))
  );

export default configureStore;
