// redux
import { Store, AnyAction, Reducer } from "redux";
// react-router-redux
import { RouterState } from "react-router-redux";
// types
import { TAction } from "./types/TAction";
// interfaces
import IApp from "./interfaces/IApp";

declare global {
  interface Window {
    store: Store<
      CombinedState<{
        app: IApp;
        routing: Reducer<RouterState, AnyAction>;
      }>,
      TAction
    > & {
      dispatch: unknown;
    };
  }
}
