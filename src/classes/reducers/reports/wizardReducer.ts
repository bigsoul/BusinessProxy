import { IWizardReducer } from "../../../interfaces/IStore";
import {
  TAction,
  WIZARD_SETUP_FILE,
  WIZARD_SETUP_CONTRACT_ID,
  WIZARD_CONFIRM,
  WIZARD_CONFIRM_SUCCESS,
  WIZARD_CONFIRM_FAILED,
  WIZARD_CLEAR_ERROR,
  WIZARD_SETUP_PROGRESS,
} from "../../../types/TAction";

const preloadedState: IWizardReducer = {
  isLoading: false,
  errorText: "",
  contractId: "",
  file10: null,
  file20: null,
  file30: null,
  progressFile10: 0,
  progressFile20: 0,
  progressFile30: 0,
  saccess: false,
};

const wizardReducer = (curState: IWizardReducer = preloadedState, action: TAction): IWizardReducer => {
  switch (action.type) {
    case WIZARD_SETUP_CONTRACT_ID: {
      const newState: IWizardReducer = {
        ...curState,
        contractId: action.contractId,
        file10: null,
        file20: null,
        file30: null,
        progressFile10: 0,
        progressFile20: 0,
        progressFile30: 0,
        saccess: false,
      };
      return newState;
    }
    case WIZARD_SETUP_FILE: {
      const newState: IWizardReducer = {
        ...curState,
      };
      switch (action.fileType) {
        case 10: {
          newState.file10 = action.file;
          break;
        }
        case 20: {
          newState.file20 = action.file;
          break;
        }
        case 30: {
          newState.file30 = action.file;
          break;
        }
        default:
          newState.errorText = "Попытка загрузить неизвестный тип файла.";
      }
      return newState;
    }
    case WIZARD_SETUP_PROGRESS: {
      const newState: IWizardReducer = {
        ...curState,
      };
      switch (action.fileType) {
        case 10: {
          newState.progressFile10 = action.progress;
          break;
        }
        case 20: {
          newState.progressFile20 = action.progress;
          break;
        }
        case 30: {
          newState.progressFile30 = action.progress;
          break;
        }
        default:
          newState.errorText = "Внутренняя ошибка в процессе загрузки файла.";
      }
      return newState;
    }
    case WIZARD_CONFIRM: {
      const newState: IWizardReducer = {
        ...curState,
        isLoading: true,
        errorText: "",
        saccess: false,
      };
      return newState;
    }
    case WIZARD_CONFIRM_SUCCESS: {
      const newState: IWizardReducer = {
        ...curState,
        isLoading: false,
        errorText: "",
        saccess: true,
      };
      return newState;
    }
    case WIZARD_CONFIRM_FAILED: {
      const newState: IWizardReducer = {
        ...curState,
        isLoading: false,
        file10: null,
        file20: null,
        file30: null,
        progressFile10: 0,
        progressFile20: 0,
        progressFile30: 0,
        saccess: false,
        errorText: action.errorText,
      };
      return newState;
    }
    case WIZARD_CLEAR_ERROR: {
      const newState: IWizardReducer = {
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

export default wizardReducer;
