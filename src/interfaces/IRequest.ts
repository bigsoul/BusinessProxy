import IReport from "./IReport";
import IFile from "./IFile";

export interface ILoginRequest {
  login: string;
  password: string;
}

export interface ILogoutRequest {
  apikey: string;
}

export interface IGetContractsRequest {
  apikey: string;
}

export interface IGetReportsRequest {
  apikey: string;
  contractId: string;
}

export interface ISetReportsRequest {
  apikey: string;
  list: IReport[];
}

export interface IUpdReportsRequest {
  apikey: string;
  list: IReport[];
}

export interface IDelReportsRequest {
  apikey: string;
  list: IReport[];
}

export interface IConfirmRequest {
  apikey: string;
  reportsId: string[];
}

export interface IGetFilesRequest {
  apikey: string;
  reportId: string;
}

export interface ISetFilesRequest {
  apikey: string;
  list: IFile[];
}

export interface IUpdFilesRequest {
  apikey: string;
  list: IFile[];
}

export interface IDelFilesRequest {
  apikey: string;
  list: IFile[];
}

export interface IFileUploadRequest extends ArrayBuffer {}

export type TRequest =
  | ILoginRequest
  | ILogoutRequest
  | IGetContractsRequest
  | IGetReportsRequest
  | ISetReportsRequest
  | IUpdReportsRequest
  | IDelReportsRequest
  | IConfirmRequest
  | IGetFilesRequest
  | ISetFilesRequest
  | IUpdFilesRequest
  | IDelFilesRequest
  | IFileUploadRequest;
