import {
  TAction,
  LOGIN,
  LOGOUT,
  LOGIN_SUCCESS,
  LOGIN_FAILED,
  LOGOUT_SUCCESS,
  LOGOUT_FAILED,
  USER_CLEAR_ERROR,
  INIT,
} from "../../interfaces/IAction";
import IUser from "../../interfaces/IUser";

const preloadedState: IUser = {
  apikey: localStorage.getItem("apikey") || "",
  name: localStorage.getItem("name") || "",
  isLoading: false,
  errorText: "",
};

const userReducer = (curState: IUser = preloadedState, action: TAction): IUser => {
  switch (action.type) {
    case INIT: {
      return curState;
    }
    case LOGIN: {
      const newState: IUser = {
        ...curState,
        isLoading: true,
        errorText: "",
      };
      return newState;
    }
    case LOGIN_SUCCESS: {
      const newState: IUser = {
        ...curState,
        isLoading: false,
        apikey: action.apikey,
        name: action.name,
      };
      return newState;
    }
    case LOGIN_FAILED: {
      const newState: IUser = {
        ...curState,
        isLoading: false,
        errorText: action.errorText,
      };
      return newState;
    }
    case LOGOUT: {
      const newState: IUser = {
        ...curState,
        isLoading: true,
      };
      return newState;
    }
    case LOGOUT_SUCCESS: {
      const newState: IUser = {
        ...curState,
        isLoading: false,
        errorText: "",
        apikey: "",
        name: "",
      };
      return newState;
    }
    case LOGOUT_FAILED: {
      const newState: IUser = {
        ...curState,
        isLoading: false,
        errorText: action.errorText,
      };
      return newState;
    }
    case USER_CLEAR_ERROR: {
      const newState: IUser = {
        ...curState,
        isLoading: false,
        errorText: "",
      };
      return newState;
    }
    default:
      return curState;
  }
};

export default userReducer;
