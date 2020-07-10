// constants
import { LOGIN, REPORT_ADD_SIMPLY } from "./../../types/TAction";
import { LOGOUT } from "./../../types/TAction";
import { REPORT_ADD } from "./../../types/TAction";
import { REPORT_UPDATE } from "./../../types/TAction";
import { REPORT_DELETE } from "./../../types/TAction";
import { REPORT_CURRENT_SET } from "./../../types/TAction";
import { REPORT_CURRENT_DEL } from "./../../types/TAction";
import { FILE_CURRENT_SET } from "./../../types/TAction";
import { FILE_ADD } from "./../../types/TAction";
import { FILE_UPDATE } from "./../../types/TAction";
import { FILE_DELETE } from "./../../types/TAction";
import { UPDATE_CONTRACTS } from "./../../types/TAction";
import { UPDATE_REPORTS } from "./../../types/TAction";
import { UPDATE_FILES } from "./../../types/TAction";
// types
import { TAction } from "./../../types/TAction";
// interfaces
import IApp from "./../../interfaces/IApp";
import IContract from "./../../interfaces/IContract";
import IReport from "./../../interfaces/IReport";
import IFile from "./../../interfaces/IFile";
// classes
import { contractRefresh, reportRefresh, getFiles } from "./../../classes/Requests";

export const appPreloadedState = (): IApp => {
  return {
    apikey: "",
    name: "",
    loginState: { state: 0 },
    path: "",
    files: [],
    reportId: "",
    reports: [],
    contractId: "",
    contracts: [],
  };
};

export const appReducer = (curState: IApp = appPreloadedState(), action: TAction): IApp => {
  switch (action.type) {
    case LOGIN: {
      const newState = {
        ...curState,
        apikey: action.response.apikey,
        name: action.response.name,
        loginState: {
          ...curState.loginState,
          state: action.response.loginState.state,
        },
      };
      setTimeout(contractRefresh, 0);
      return newState;
    }
    case LOGOUT: {
      const newState = {
        ...curState,
        apikey: action.response.apikey,
        name: action.response.name,
      };
      return newState;
    }
    case REPORT_ADD: {
      const newData = action.newData[0];

      const contract = getContractById(curState.contracts, newData.contractId);
      const newState = {
        ...curState,
      };
      newState.contracts.forEach((element: IContract) => {
        if (element.id === contract.id) {
          element.reports = [...element.reports];
          element.reports.push({
            id: newData.id,
            contractId: newData.contractId,
            name: newData.name,
            state: newData.state,
            files: [],
          });
        }
      });
      return reducerReportCurrentSet(newState, contract.id);
    }
    case REPORT_ADD_SIMPLY: {
      return { ...curState, path: action.path, contractId: action.contractId };
    }
    case REPORT_UPDATE: {
      const newData = action.newData[0];

      const contract = getContractById(curState.contracts, newData.contractId);
      const newState = {
        ...curState,
      };
      newState.contracts.forEach((contr: IContract) => {
        if (contr.id === contract.id) {
          contr.reports = [...contr.reports];
          contr.reports.forEach((rep: IReport) => {
            if (rep.id === newData.id) {
              rep.name = newData.name;
              rep.state = newData.state;
            }
          });
        }
      });
      return reducerReportCurrentSet(newState, contract.id);
    }
    case REPORT_DELETE: {
      const delData = action.dataDelete[0];

      const contract = getContractById(curState.contracts, delData.contractId);
      const newState = {
        ...curState,
      };
      newState.contracts.forEach((contr: IContract) => {
        if (contr.id === contract.id) {
          contr.reports = [...contr.reports];
          contr.reports.forEach((rep: IReport, index: number) => {
            if (rep.id === delData.id) {
              contr.reports.splice(index, 1);
            }
          });
        }
      });
      return reducerReportCurrentSet(newState, contract.id);
    }
    case REPORT_CURRENT_SET: {
      const newState = reducerReportCurrentSet(curState, action.contractId);

      if (newState.reports.length === 0) setTimeout(reportRefresh, 0, newState.contractId);

      return newState;
    }
    case REPORT_CURRENT_DEL: {
      const newState = {
        ...curState,
        contractId: "",
        reports: [],
        reportId: "",
        files: [],
        path: "",
      };
      return newState;
    }
    case FILE_CURRENT_SET: {
      const contract = getContractById(curState.contracts, action.contractId);
      const report = getReportById(contract.reports, action.reportId);
      const newState = {
        ...curState,
        contractId: action.contractId,
        reportId: action.reportId,
        reports: [],
        files: [...report.files],
      };

      if (newState.files.length === 0) setTimeout(getFiles, 0, contract.id, report.id);

      return newState;
    }
    case FILE_ADD: {
      const newData = action.newData[0];

      const contract = getContractById(curState.contracts, action.contractId);
      const report = getReportById(contract.reports, newData.reportId);
      const newState = {
        ...curState,
      };
      newState.contracts.forEach((contr: IContract) => {
        if (contr.id === contract.id) {
          contr.reports.forEach((rep: IReport) => {
            if (rep.id === report.id) {
              rep.files = [...rep.files];
              rep.files.push(newData);
              newState.files = rep.files;
            }
          });
        }
      });

      return newState;
    }
    case FILE_UPDATE: {
      const newData = action.newData[0];

      const contract = getContractById(curState.contracts, action.contractId);
      const report = getReportById(contract.reports, newData.reportId);
      const newState = {
        ...curState,
      };
      newState.contracts.forEach((contr: IContract) => {
        if (contr.id === contract.id) {
          contr.reports.forEach((rep: IReport) => {
            if (rep.id === report.id) {
              rep.files = [...rep.files];
              rep.files.forEach((file: IFile, i: number) => {
                if (file.id === newData.id) rep.files[i] = newData;
              });
              newState.files = rep.files;
            }
          });
        }
      });
      return newState;
    }
    case FILE_DELETE: {
      const delData = action.dataDelete[0];

      const contract = getContractById(curState.contracts, action.contractId);
      const report = getReportById(contract.reports, delData.reportId);
      const newState = {
        ...curState,
      };
      newState.contracts.forEach((contr: IContract) => {
        if (contr.id === contract.id) {
          contr.reports.forEach((rep: IReport) => {
            if (rep.id === report.id) {
              rep.files = [...rep.files];
              rep.files.forEach((file: IFile, index: number) => {
                if (file.id === delData.id) {
                  rep.files.splice(index, 1);
                }
              });
              newState.files = rep.files;
            }
          });
        }
      });
      return newState;
    }
    case UPDATE_CONTRACTS: {
      const newState = {
        ...curState,
        contracts: action.contracts,
      };

      return newState;
    }
    case UPDATE_REPORTS: {
      const newState = {
        ...curState,
      };

      const contract = getContractById(newState.contracts, action.contractId);

      contract.reports = action.reports;
      newState.reports = action.reports;

      return newState;
    }
    case UPDATE_FILES: {
      const contract = getContractById(curState.contracts, action.contractId);
      const report = getReportById(contract.reports, action.reportId);
      const newState = {
        ...curState,
      };
      newState.contracts.forEach((contr: IContract) => {
        if (contr.id === contract.id) {
          contr.reports.forEach((rep: IReport) => {
            if (rep.id === report.id) {
              rep.files = [...action.files];
              newState.files = rep.files;
            }
          });
        }
      });
      return newState;
    }
    default:
      return curState;
  }
};

const reducerReportCurrentSet = (curState: IApp, contractId: string): IApp => {
  const contract = getContractById(curState.contracts, contractId);
  const newState = {
    ...curState,
    contractId: contract.id,
    reports: contract.reports,
    reportId: "",
  };

  return newState;
};

const getReportById = (arr: IReport[], id: string): IReport => {
  const report = arr.find((item: IReport, index: number, array: IReport[]) => {
    if (item.id === id) {
      return true;
    }
    return false;
  });

  if (report) {
    return report;
  } else {
    throw new EvalError("[getReportById] = Report not found.");
  }
};

const getContractById = (arr: IContract[], id: string): IContract => {
  const contract = arr.find((item: IContract, index: number, array: IContract[]) => {
    if (item.id === id) {
      return true;
    }
    return false;
  });

  if (contract) {
    return contract;
  } else {
    throw new EvalError("[getContractById] = Contract not found.");
  }
};
