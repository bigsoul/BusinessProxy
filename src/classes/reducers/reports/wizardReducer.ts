import { IWizardReducer } from "../../../interfaces/IStore";
import { TAction, WIZARD_SETUP_FILE } from "../../../types/TAction";

const preloadedState: IWizardReducer = {
  isLoading: false,
  errorText: "",
  contractId: "",
  files: [
    {
      fileType: 0,
      file: null,
    },
  ],
};

const wizardReducer = (curState: IWizardReducer = preloadedState, action: TAction): IWizardReducer => {
  switch (action.type) {
    case WIZARD_SETUP_FILE: {
      const newState: IWizardReducer = {
        ...curState,
      };
      return newState;
    }
    default:
      return curState;
  }
};

export default wizardReducer;
