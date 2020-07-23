import IUser from "./IUser";
import { RouterState } from "connected-react-router";
import { LocationState } from "history";
import IContract from "./IContract";
import IReport from "./IReport";

export default interface IStore {
  user: IUser;
  contracts: IContractsReducer;
  reports: IReportsReducer;
  router: RouterState<LocationState>;
}

export interface IContractsReducer {
  isLoading: boolean;
  errorText: string;
  list: IContract[];
}

export interface IReportsReducer {
  isLoading: boolean;
  errorText: string;
  list: IReport[];
}
