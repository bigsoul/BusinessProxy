import { TAction, GET_CONTRACTS, GET_CONTRACTS_SUCCESS, GET_CONTRACTS_FAILED } from "./../../types/TAction";
import { IContractsReducer } from "../../interfaces/IStore";

const preloadedState: IContractsReducer = {
  isLoading: false,
  errorText: "",
  list: [],
};

const contractsReducer = (curState: IContractsReducer = preloadedState, action: TAction): IContractsReducer => {
  switch (action.type) {
    case GET_CONTRACTS: {
      const newState: IContractsReducer = {
        ...curState,
        isLoading: true,
        errorText: "",
      };
      return newState;
    }
    case GET_CONTRACTS_SUCCESS: {
      const newState: IContractsReducer = {
        ...curState,
        isLoading: false,
        errorText: "",
        list: [...action.contracts],
      };
      return newState;
    }
    case GET_CONTRACTS_FAILED: {
      const newState: IContractsReducer = {
        ...curState,
        isLoading: false,
        errorText: action.errorText,
      };
      return newState;
    }
    default:
      return curState;
  }
};

export default contractsReducer;
