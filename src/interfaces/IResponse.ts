import IContract from "./IContract";
import IReport from "./IReport";
import IFile from "./IFile";

export interface ILoginResponse {
  errorText: string;
  apikey: string;
  name: string;
}

export interface ILogoutResponse {
  errorText: string;
  apikey: string;
  name: string;
}

export interface IGetContractsResponse {
  errorText: string;
  list: IContract[];
}

export interface IGetReportsResponse {
  errorText: string;
  list: IReport[];
}

export interface ISetReportsResponse {
  errorText: string;
  list: IReport[];
}

export interface IUpdReportsResponse {
  errorText: string;
  list: IReport[];
}

export interface IDelReportsResponse {
  errorText: string;
  list: [
    {
      id: string;
      contractId: string;
      success: boolean;
    }
  ];
}

export interface IConfirmResponse {
  errorText: string;
  list: IReport[];
}

export interface IGetFilesResponse {
  errorText: string;
  list: IFile[];
}

export interface ISetFilesResponse {
  errorText: string;
  list: IFile[];
}

export interface IUpdFilesResponse {
  errorText: string;
  list: IFile[];
}

export interface IDelFilesResponse {
  errorText: string;
  list: [
    {
      id: string;
      reportId: string;
      success: boolean;
    }
  ];
}

export interface IFileUploadResponse {
  errorText: string;
  success: boolean;
}

export type TResponse =
  | ILoginResponse
  | ILogoutResponse
  | IGetContractsResponse
  | IGetReportsResponse
  | ISetReportsResponse
  | IUpdReportsResponse
  | IDelReportsResponse
  | IConfirmResponse
  | IGetFilesResponse
  | ISetFilesResponse
  | IUpdFilesResponse
  | IDelFilesResponse
  | IFileUploadResponse;
