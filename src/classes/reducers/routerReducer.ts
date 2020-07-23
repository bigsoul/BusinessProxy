import { connectRouter } from "connected-react-router";
import { createBrowserHistory } from "history";

export const history = createBrowserHistory();

const routerReducer = connectRouter(history);

export default routerReducer;
