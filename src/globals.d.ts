// redux
import { Store, AnyAction, Reducer } from "redux";
// react-router-redux
import { RouterState } from "react-router-redux";
// types
import { TAction } from "./types/TAction";
// interfaces
import BrowserHistory from "history";
import IUser from "./interfaces/IUser";

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
    homepage: string;
  }
}
