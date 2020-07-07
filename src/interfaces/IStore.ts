import IApp from "./IApp";
import { RouterState } from "react-router-redux";
import { AnyAction, Reducer } from "redux";

export default interface IStore {
  app: IApp;
  routing: Reducer<RouterState, AnyAction>;
}
