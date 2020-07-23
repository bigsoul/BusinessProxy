import { createBrowserHistory } from "history";
import { applyMiddleware, compose, createStore } from "redux";
import { routerMiddleware } from "connected-react-router";
import createRootReducer from "./reducers";
import IApp from "../interfaces/IApp";
import { Reducer } from "react";
import { TAction } from "../types/TAction";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import createSagaMiddleware from "redux-saga";
import logger from "redux-logger";
import { watchLogin } from "./sagas";

import { history } from "./reducers/routerReducer";

export const sagaMiddleware = createSagaMiddleware();

const configureStore = () => {
  const store = createStore(
    createRootReducer(),
    {},
    composeWithDevTools(applyMiddleware(thunk, logger, sagaMiddleware, routerMiddleware(history)))
  );

  sagaMiddleware.run(watchLogin);

  return store;
};

export default configureStore;
