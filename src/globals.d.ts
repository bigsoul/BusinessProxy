// redux
import { Store } from "redux";
// interfaces
import IStore from "./interfaces/IStore";

declare global {
  interface Window {
    store: Store<IStore, any>;
  }
}
