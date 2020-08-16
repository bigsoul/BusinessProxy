// redux
import { Store, AnyAction, Reducer } from "redux";
// react-router-redux
import { RouterState } from "react-router-redux";
// types
import { TAction } from "./types/TAction";
// interfaces
import IApp from "./interfaces/IApp";
import BrowserHistory from "history";
import IUser from "./interfaces/IUser";
import IStore from "./interfaces/IStore";

declare global {
  interface Window {
    /*store: Store<CombinedState<IStore>, TAction> & {
      dispatch: unknown;
    };*/
    store: Store<
      CombinedState<{
        user: IUser;
        router: RouterState<PoorMansUnknown>;
      }>,
      TAction | LocationChangeAction<any>
    > & {
      dispatch: unknown;
    };
    _history: BrowserHistory;
    origin: string;
  }
}
