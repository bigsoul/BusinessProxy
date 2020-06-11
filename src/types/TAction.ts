export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";
export const REPORT_ADD = "REPORT_ADD";
export const REPORT_UPDATE = "REPORT_UPDATE";
export const REPORT_DELETE = "REPORT_DELETE";
export const REPORT_CURRENT_SET = "REPORT_CURRENT_SET";
export const REPORT_CURRENT_DEL = "REPORT_CURRENT_DEL";
export const FILE_CURRENT_SET = "FILE_CURRENT_SET";
export const FILE_ADD = "FILE_ADD";
export const FILE_UPDATE = "FILE_UPDATE";
export const FILE_DELETE = "FILE_DELETE";
export const UPDATE_CONTRACTS = "UPDATE_CONTRACTS";
export const UPDATE_REPORTS = "UPDATE_REPORTS";
export const UPDATE_FILES = "UPDATE_FILES";

export interface ILoginAction {
  type: typeof LOGIN;
  response: any;
}

export interface ILogoutAction {
  type: typeof LOGOUT;
  response: any;
}

export interface IReportAddAction {
  type: typeof REPORT_ADD;
  newData: any;
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

export interface IUpdateContractsAction {
  type: typeof UPDATE_CONTRACTS;
  contracts: any;
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
  | ILogoutAction
  | IReportAddAction
  | IReportUpdateAction
  | IReportDeleteAction
  | IReportCurrentSetAction
  | IReportCurrentDelAction
  | IFileCurrentSetAction
  | IFileAddAction
  | IFileUpdateAction
  | IFileDeleteAction
  | IUpdateContractsAction
  | IUpdateReportsAction
  | IUpdateFilesAction;
