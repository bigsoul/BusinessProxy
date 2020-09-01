import { applyMiddleware, createStore } from "redux";
import { routerMiddleware } from "connected-react-router";
import createRootReducer from "./reducers";
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
    composeWithDevTools(applyMiddleware(thunk, sagaMiddleware, routerMiddleware(history)))
  );

  sagaMiddleware.run(watchLogin);

  return store;
};

export default configureStore();
