import { IFilesReducer } from "../../interfaces/IStore";
import {
  TAction,
  GET_FILES,
  GET_FILES_SUCCESS,
  GET_FILES_FAILED,
  SET_FILES,
  SET_FILES_SUCCESS,
  SET_FILES_FAILED,
  UPD_FILES,
  UPD_FILES_SUCCESS,
  UPD_FILES_FAILED,
  DEL_FILES,
  DEL_FILES_SUCCESS,
  DEL_FILES_FAILED,
} from "../../types/TAction";

const preloadedState: IFilesReducer = {
  isLoading: false,
  errorText: "",
  list: [],
};

const contractsReducer = (curState: IFilesReducer = preloadedState, action: TAction): IFilesReducer => {
  switch (action.type) {
    case GET_FILES: {
      const newState: IFilesReducer = {
        ...curState,
        isLoading: true,
        errorText: "",
      };
      return newState;
    }
    case GET_FILES_SUCCESS: {
      const newState: IFilesReducer = {
        ...curState,
        isLoading: false,
        errorText: "",
        list: [...action.files],
      };
      return newState;
    }
    case GET_FILES_FAILED: {
      const newState: IFilesReducer = {
        ...curState,
        isLoading: false,
        errorText: action.errorText,
      };
      return newState;
    }
    case SET_FILES: {
      const newState: IFilesReducer = {
        ...curState,
        isLoading: true,
        errorText: "",
      };
      return newState;
    }
    case SET_FILES_SUCCESS: {
      const newState: IFilesReducer = {
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
    case SET_FILES_FAILED: {
      const newState: IFilesReducer = {
        ...curState,
        isLoading: false,
        errorText: action.errorText,
      };
      return newState;
    }
    case UPD_FILES: {
      const newState: IFilesReducer = {
        ...curState,
        isLoading: true,
        errorText: "",
      };
      return newState;
    }
    case UPD_FILES_SUCCESS: {
      const newState: IFilesReducer = {
        ...curState,
        isLoading: false,
        errorText: "",
        list: [...curState.list],
      };
      action.list.forEach((srvElement, srvIndex) => {
        const cltIndex = newState.list.findIndex((cltElement) => {
          return cltElement.id === srvElement.id;
        });
        newState.list[cltIndex] = { ...action.list[srvIndex] };
      });
      return newState;
    }
    case UPD_FILES_FAILED: {
      const newState: IFilesReducer = {
        ...curState,
        isLoading: false,
        errorText: action.errorText,
      };
      return newState;
    }
    case DEL_FILES: {
      const newState: IFilesReducer = {
        ...curState,
        isLoading: true,
        errorText: "",
      };
      return newState;
    }
    case DEL_FILES_SUCCESS: {
      const newState: IFilesReducer = {
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
    case DEL_FILES_FAILED: {
      const newState: IFilesReducer = {
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

export default contractsReducer;
