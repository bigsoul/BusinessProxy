import { combineReducers } from "redux";
import userReducer from "./userReducer";
import routerReducer from "./routerReducer";
import contractsReducer from "./contractsReducer";
import reportsReducer from "./reports/reportsReducer";
import filesReducer from "./filesReducer";

const createRootReducer = () =>
  combineReducers({
    user: userReducer,
    contracts: contractsReducer,
    reports: reportsReducer,
    files: filesReducer,
    router: routerReducer,
  });

export default createRootReducer;
