import IReport from "../../../interfaces/IReport";
import { TAction, REPORT_CURRENT_SET } from "./../../../types/TAction";
import { reportRefresh } from "../../Requests";

const preloadedState: IReport[] = [];

const reportsReducer = (curState: IReport[] = preloadedState, action: TAction): IReport[] => {
  switch (action.type) {
    case REPORT_CURRENT_SET: {
      /*const newState = reducerReportCurrentSet(curState, action.contractId);

      if (newState.reports.length === 0) setTimeout(reportRefresh, 0, action.contractId);

      return newState;*/
    }
    default:
      return curState;
  }
};

export default reportsReducer;
