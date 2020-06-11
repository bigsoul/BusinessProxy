// redux
import { Store } from "redux";
// types
import { TAction } from "./types/TAction";
// interfaces
import IStore from "./interfaces/IStore";

declare global {
  interface Window {
    store: Store<IStore, TAction>;
  }
}
