import IContract from "../interfaces/IContract";

export const LOGIN = "LOGIN";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILED = "LOGIN_FAILED";

export const LOGOUT = "LOGOUT";
export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";
export const LOGOUT_FAILED = "LOGOUT_FAILED";

export const GET_CONTRACTS = "GET_CONTRACTS";
export const GET_CONTRACTS_SUCCESS = "GET_CONTRACTS_SUCCESS";
export const GET_CONTRACTS_FAILED = "GET_CONTRACTS_FAILED";

export const UPDATE_REPORTS = "UPDATE_REPORTS";
export const UPDATE_REPORTS_SUCCESS = "UPDATE_REPORTS_SUCCESS";
export const UPDATE_REPORTS_FAILED = "UPDATE_REPORTS_FAILED";

export const REPORT_ADD = "REPORT_ADD";
export const REPORT_ADD_SUCCESS = "REPORT_ADD_SUCCESS";
export const REPORT_ADD_FAILED = "REPORT_ADD_FAILED";

export const REPORT_UPDATE = "REPORT_UPDATE";
export const REPORT_UPDATE_SUCCESS = "REPORT_UPDATE_SUCCESS";
export const REPORT_UPDATE_FAILED = "REPORT_UPDATE_FAILED";

export const REPORT_DELETE = "REPORT_DELETE";
export const REPORT_DELETE_SUCCESS = "REPORT_DELETE_SUCCESS";
export const REPORT_DELETE_FAILED = "REPORT_DELETE_FAILED";

export const REPORT_SIMPLY = "REPORT_SIMPLY";
export const REPORT_SIMPLY_SUCCESS = "REPORT_SIMPLY_SUCCESS";
export const REPORT_SIMPLY_FAILED = "REPORT_SIMPLY_FAILED";

export const UPDATE_FILES = "UPDATE_FILES";
export const UPDATE_FILES_SUCCESS = "UPDATE_FILES_SUCCESS";
export const UPDATE_FILES_FAILED = "UPDATE_FILES_FAILED";

export const FILE_ADD = "FILE_ADD";
export const FILE_ADD_SUCCESS = "FILE_ADD_SUCCESS";
export const FILE_ADD_FAILED = "FILE_ADD_FAILED";

export const FILE_UPDATE = "FILE_UPDATE";
export const FILE_UPDATE_SUCCESS = "FILE_UPDATE_SUCCESS";
export const FILE_UPDATE_FAILED = "FILE_UPDATE_FAILED";

export const FILE_DELETE = "FILE_DELETE";
export const FILE_DELETE_SUCCESS = "FILE_DELETE_SUCCESS";
export const FILE_DELETE_FAILED = "FILE_DELETE_FAILED";

export const REPORT_CURRENT_SET = "REPORT_CURRENT_SET";
export const REPORT_CURRENT_DEL = "REPORT_CURRENT_DEL";
export const FILE_CURRENT_SET = "FILE_CURRENT_SET";

export interface ILoginAction {
  type: typeof LOGIN;
  userLogin: string;
  userPassword: string;
}

export interface ILoginSuccessAction {
  type: typeof LOGIN_SUCCESS;
  apikey: string;
  name: string;
}

export interface ILoginFailedAction {
  type: typeof LOGIN_FAILED;
  errorText: string;
}

export interface ILogoutAction {
  type: typeof LOGOUT;
  apikey: string;
}

export interface ILogoutSuccessAction {
  type: typeof LOGOUT_SUCCESS;
}

export interface ILogoutFailedAction {
  type: typeof LOGOUT_FAILED;
  errorText: string;
}

export interface IReportAddAction {
  type: typeof REPORT_ADD;
  newData: any;
}

export interface IReportAddSimplyAction {
  type: typeof REPORT_SIMPLY;
  path: string;
  contractId: string;
}

export interface IReportUpdateAction {
  type: typeof REPORT_UPDATE;
  newData: any;
}

export interface IReportDeleteAction {
  type: typeof REPORT_DELETE;
  dataDelete: any;
}

export interface IReportCurrentSetAction {
  type: typeof REPORT_CURRENT_SET;
  contractId: string;
}

export interface IReportCurrentDelAction {
  type: typeof REPORT_CURRENT_DEL;
}

export interface IFileCurrentSetAction {
  type: typeof FILE_CURRENT_SET;
  contractId: string;
  reportId: string;
}

export interface IFileAddAction {
  type: typeof FILE_ADD;
  contractId: string;
  newData: any;
}

export interface IFileUpdateAction {
  type: typeof FILE_UPDATE;
  contractId: string;
  newData: any;
}

export interface IFileDeleteAction {
  type: typeof FILE_DELETE;
  contractId: string;
  dataDelete: any;
}

export interface IGetContractsAction {
  type: typeof GET_CONTRACTS;
  apikey: string;
}

export interface IGetContractsSuccessAction {
  type: typeof GET_CONTRACTS_SUCCESS;
  contracts: IContract[];
}

export interface IGetContractsFailedAction {
  type: typeof GET_CONTRACTS_FAILED;
  errorText: string;
}

export interface IUpdateReportsAction {
  type: typeof UPDATE_REPORTS;
  contractId: string;
  reports: any;
}

export interface IUpdateFilesAction {
  type: typeof UPDATE_FILES;
  contractId: string;
  reportId: string;
  files: any;
}

export type TAction =
  | ILoginAction
  | ILoginSuccessAction
  | ILoginFailedAction
  | ILogoutAction
  | ILogoutSuccessAction
  | ILogoutFailedAction
  | IReportAddAction
  | IReportAddSimplyAction
  | IReportUpdateAction
  | IReportDeleteAction
  | IReportCurrentSetAction
  | IReportCurrentDelAction
  | IFileCurrentSetAction
  | IFileAddAction
  | IFileUpdateAction
  | IFileDeleteAction
  | IGetContractsAction
  | IGetContractsSuccessAction
  | IGetContractsFailedAction
  | IUpdateReportsAction
  | IUpdateFilesAction;
