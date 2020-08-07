import {
  TAction,
  GET_REPORTS,
  GET_REPORTS_SUCCESS,
  GET_REPORTS_FAILED,
  SET_REPORTS,
  SET_REPORTS_SUCCESS,
  SET_REPORTS_FAILED,
  UPD_REPORTS,
  UPD_REPORTS_SUCCESS,
  UPD_REPORTS_FAILED,
  DEL_REPORTS,
  DEL_REPORTS_SUCCESS,
  DEL_REPORTS_FAILED,
  CONFIRM,
  CONFIRM_SUCCESS,
  CONFIRM_FAILED,
  IConfirmSuccessAction,
  IUpdReportsSuccessAction,
} from "../../../types/TAction";
import { IReportsReducer } from "../../../interfaces/IStore";

const preloadedState: IReportsReducer = {
  isLoading: false,
  errorText: "",
  list: [],
};

const reportsReducer = (curState: IReportsReducer = preloadedState, action: TAction): IReportsReducer => {
  switch (action.type) {
    case GET_REPORTS: {
      const newState: IReportsReducer = {
        ...curState,
        isLoading: true,
        errorText: "",
      };
      return newState;
    }
    case GET_REPORTS_SUCCESS: {
      const newState: IReportsReducer = {
        ...curState,
        isLoading: false,
        errorText: "",
        list: [...action.reports],
      };
      return newState;
    }
    case GET_REPORTS_FAILED: {
      const newState: IReportsReducer = {
        ...curState,
        isLoading: false,
        errorText: action.errorText,
      };
      return newState;
    }
    case SET_REPORTS: {
      const newState: IReportsReducer = {
        ...curState,
        isLoading: true,
        errorText: "",
      };
      return newState;
    }
    case SET_REPORTS_SUCCESS: {
      const newState: IReportsReducer = {
        ...curState,
        isLoading: false,
        errorText: "",
        list: [...curState.list],
      };
      action.list.forEach((element) => {
        newState.list.push(element);
      });
      return newState;
    }
    case SET_REPORTS_FAILED: {
      const newState: IReportsReducer = {
        ...curState,
        isLoading: false,
        errorText: "",
      };
      return newState;
    }
    case UPD_REPORTS: {
      const newState: IReportsReducer = {
        ...curState,
        isLoading: true,
        errorText: "",
      };
      return newState;
    }
    case UPD_REPORTS_SUCCESS: {
      const newState: IReportsReducer = {
        ...curState,
        isLoading: false,
        errorText: "",
        list: [...curState.list],
      };
      updReports(newState, action);
      return newState;
    }
    case UPD_REPORTS_FAILED: {
      const newState: IReportsReducer = {
        ...curState,
        isLoading: false,
        errorText: "",
      };
      return newState;
    }
    case DEL_REPORTS: {
      const newState: IReportsReducer = {
        ...curState,
        isLoading: true,
        errorText: "",
      };
      return newState;
    }
    case DEL_REPORTS_SUCCESS: {
      const newState: IReportsReducer = {
        ...curState,
        isLoading: false,
        errorText: "",
        list: [...curState.list],
      };
      action.list.forEach((srvElement) => {
        const index = newState.list.findIndex((cltElement) => {
          return cltElement.id === srvElement.id;
        });
        newState.list.splice(index, 1);
      });
      return newState;
    }
    case DEL_REPORTS_FAILED: {
      const newState: IReportsReducer = {
        ...curState,
        isLoading: false,
        errorText: action.errorText,
      };
      return newState;
    }
    case CONFIRM: {
      const newState: IReportsReducer = {
        ...curState,
        isLoading: true,
        errorText: "",
      };
      return newState;
    }
    case CONFIRM_SUCCESS: {
      const newState: IReportsReducer = {
        ...curState,
        isLoading: false,
        errorText: "",
        list: [...curState.list],
      };
      updReports(newState, action);
      return newState;
    }
    case CONFIRM_FAILED: {
      const newState: IReportsReducer = {
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

// общие методы

const updReports = (newState: IReportsReducer, action: IConfirmSuccessAction | IUpdReportsSuccessAction): void => {
  action.list.forEach((srvElement, srvIndex) => {
    const cltIndex = newState.list.findIndex((cltElement) => {
      return cltElement.id === srvElement.id;
    });
    newState.list[cltIndex] = { ...action.list[srvIndex] };
  });
};

export default reportsReducer;
