import IContract from "../interfaces/IContract";
import IReport from "../interfaces/IReport";
import IFile from "../interfaces/IFile";

// auth

export const INIT = "@@INIT";

export const LOGIN = "LOGIN";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILED = "LOGIN_FAILED";

export const LOGOUT = "LOGOUT";
export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";
export const LOGOUT_FAILED = "LOGOUT_FAILED";

export const USER_CLEAR_ERROR = "USER_CLEAR_ERROR";

// contracts

export const GET_CONTRACTS = "GET_CONTRACTS";
export const GET_CONTRACTS_SUCCESS = "GET_CONTRACTS_SUCCESS";
export const GET_CONTRACTS_FAILED = "GET_CONTRACTS_FAILED";

export const CONTRACTS_CLEAR_ERROR = "CONTRACTS_CLEAR_ERROR";

// reports

export const GET_REPORTS = "GET_REPORTS";
export const GET_REPORTS_SUCCESS = "GET_REPORTS_SUCCESS";
export const GET_REPORTS_FAILED = "GET_REPORTS_FAILED";

export const SET_REPORTS = "SET_REPORTS";
export const SET_REPORTS_SUCCESS = "SET_REPORTS_SUCCESS";
export const SET_REPORTS_FAILED = "SET_REPORTS_FAILED";

export const UPD_REPORTS = "UPD_REPORTS";
export const UPD_REPORTS_SUCCESS = "UPD_REPORTS_SUCCESS";
export const UPD_REPORTS_FAILED = "UPD_REPORTS_FAILED";

export const DEL_REPORTS = "DEL_REPORTS";
export const DEL_REPORTS_SUCCESS = "DEL_REPORTS_SUCCESS";
export const DEL_REPORTS_FAILED = "DEL_REPORTS_FAILED";

export const REPORTS_CLEAR_ERROR = "REPORTS_CLEAR_ERROR";

// confirm

export const CONFIRM = "CONFIRM";
export const CONFIRM_SUCCESS = "CONFIRM_SUCCESS";
export const CONFIRM_FAILED = "CONFIRM_FAILED";

// files

export const GET_FILES = "GET_FILES";
export const GET_FILES_SUCCESS = "GET_FILES_SUCCESS";
export const GET_FILES_FAILED = "GET_FILES_FAILED";

export const SET_FILES = "SET_FILES";
export const SET_FILES_SUCCESS = "SET_FILES_SUCCESS";
export const SET_FILES_FAILED = "SET_FILES_FAILED";

export const UPD_FILES = "UPD_FILES";
export const UPD_FILES_SUCCESS = "UPD_FILES_SUCCESS";
export const UPD_FILES_FAILED = "UPD_FILES_FAILED";

export const DEL_FILES = "DEL_FILES";
export const DEL_FILES_SUCCESS = "DEL_FILES_SUCCESS";
export const DEL_FILES_FAILED = "DEL_FILES_FAILED";

export const FILE_UPLOAD = "FILE_UPLOAD";
export const FILE_UPLOAD_SUCCESS = "FILE_UPLOAD_SUCCESS";
export const FILE_UPLOAD_FAILED = "FILE_UPLOAD_FAILED";

export const FILE_DOWNLOAD = "FILE_DOWNLOAD";
export const FILE_DOWNLOAD_SUCCESS = "FILE_DOWNLOAD_SUCCESS";
export const FILE_DOWNLOAD_FAILED = "FILE_DOWNLOAD_FAILED";

export const FILES_CLEAR_ERROR = "FILES_CLEAR_ERROR";

// wizard

export const WIZARD_SETUP_CONTRACT_ID = "WIZARD_SETUP_CONTRACT_ID";
export const WIZARD_SETUP_FILE = "WIZARD_SETUP_FILE";
export const WIZARD_SETUP_PROGRESS = "WIZARD_SETUP_PROGRESS";

export const WIZARD_CLEAR_ERROR = "WIZARD_CLEAR_ERROR";

export const WIZARD_CONFIRM = "WIZARD_CONFIRM";
export const WIZARD_CONFIRM_SUCCESS = "WIZARD_CONFIRM_SUCCESS";
export const WIZARD_CONFIRM_FAILED = "WIZARD_CONFIRM_FAILED";

// INIT

export interface IInit {
  type: typeof INIT;
}

// LOGIN

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

// LOGOUT

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

// USER_CLEAR_ERROR

export interface IUserClearErrorAction {
  type: typeof USER_CLEAR_ERROR;
}

// GET_CONTRACTS

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

// CONTRACTS_CLEAR_ERROR

export interface IContractsClearErrorAction {
  type: typeof CONTRACTS_CLEAR_ERROR;
}

// GET_REPORTS

export interface IGetReportsAction {
  type: typeof GET_REPORTS;
  apikey: string;
  contractId: string;
}

export interface IGetReportsSuccessAction {
  type: typeof GET_REPORTS_SUCCESS;
  reports: IReport[];
}

export interface IGetReportsFailedAction {
  type: typeof GET_REPORTS_FAILED;
  errorText: string;
}

// SET_REPORTS

export interface ISetReportsAction {
  type: typeof SET_REPORTS;
  apikey: string;
  list: IReport[];
}

export interface ISetReportsSuccessAction {
  type: typeof SET_REPORTS_SUCCESS;
  list: IReport[];
}

export interface ISetReportsFailedAction {
  type: typeof SET_REPORTS_FAILED;
  errorText: string;
}

// UPD_REPORTS

export interface IUpdReportsAction {
  type: typeof UPD_REPORTS;
  apikey: string;
  list: IReport[];
}

export interface IUpdReportsSuccessAction {
  type: typeof UPD_REPORTS_SUCCESS;
  list: IReport[];
}

export interface IUpdReportsFailedAction {
  type: typeof UPD_REPORTS_FAILED;
  errorText: string;
}

// DEL_REPORTS

export interface IDelReportsAction {
  type: typeof DEL_REPORTS;
  apikey: string;
  list: IReport[];
}

export interface IDelReportsSuccessAction {
  type: typeof DEL_REPORTS_SUCCESS;
  list: [
    {
      id: string;
      contractId: string;
      success: boolean;
    }
  ];
}

export interface IDelReportsFailedAction {
  type: typeof DEL_REPORTS_FAILED;
  errorText: string;
}

// REPORTS_CLEAR_ERROR

export interface IReportsClearErrorAction {
  type: typeof REPORTS_CLEAR_ERROR;
}

// CONFIRM

export interface IConfirmAction {
  type: typeof CONFIRM;
  apikey: string;
  reportId: string;
}

export interface IConfirmSuccessAction {
  type: typeof CONFIRM_SUCCESS;
  list: IReport[];
}

export interface IConfirmFailedAction {
  type: typeof CONFIRM_FAILED;
  errorText: string;
}

// GET_FILES

export interface IGetFilesAction {
  type: typeof GET_FILES;
  apikey: string;
  reportId: string;
}

export interface IGetFilesSuccessAction {
  type: typeof GET_FILES_SUCCESS;
  files: IFile[];
}

export interface IGetFilesFailedAction {
  type: typeof GET_FILES_FAILED;
  errorText: string;
}

// SET_FILES

export interface ISetFilesAction {
  type: typeof SET_FILES;
  apikey: string;
  list: IFile[];
}

export interface ISetFilesSuccessAction {
  type: typeof SET_FILES_SUCCESS;
  list: IFile[];
}

export interface ISetFilesFailedAction {
  type: typeof SET_FILES_FAILED;
  errorText: string;
}

// UPD_FILES

export interface IUpdFilesAction {
  type: typeof UPD_FILES;
  apikey: string;
  list: IFile[];
}

export interface IUpdFilesSuccessAction {
  type: typeof UPD_FILES_SUCCESS;
  list: IFile[];
}

export interface IUpdFilesFailedAction {
  type: typeof UPD_FILES_FAILED;
  errorText: string;
}

// DEL_FILES

export interface IDelFilesAction {
  type: typeof DEL_FILES;
  apikey: string;
  list: IFile[];
}

export interface IDelFilesSuccessAction {
  type: typeof DEL_FILES_SUCCESS;
  list: [
    {
      id: string;
      reportId: string;
      success: boolean;
    }
  ];
}

export interface IDelFilesFailedAction {
  type: typeof DEL_FILES_FAILED;
  errorText: string;
}

// FILES_CLEAR_ERROR

export interface IFilesClearErrorAction {
  type: typeof FILES_CLEAR_ERROR;
}

// FILE_UPLOAD

export interface IFileUploadAction {
  type: typeof FILE_UPLOAD;
  apikey: string;
  id: string;
  name: string;
  file: File;
}

export interface IFileUploadSuccessAction {
  type: typeof FILE_UPLOAD_SUCCESS;
  file: IFile;
}

export interface IFileUploadFailedAction {
  type: typeof FILE_UPLOAD_FAILED;
  errorText: string;
}

// FILE_DOWNLOAD

export interface IFileDownloadAction {
  type: typeof FILE_DOWNLOAD;
}

export interface IFileDownloadSuccessAction {
  type: typeof FILE_DOWNLOAD_SUCCESS;
}

export interface IFileDownloadFailedAction {
  type: typeof FILE_DOWNLOAD_FAILED;
}

// WIZARD_SETUP_CONTRACT_ID

export interface IWizardSetupContractIdAction {
  type: typeof WIZARD_SETUP_CONTRACT_ID;
  contractId: string;
}

// WIZARD_SETUP_FILE

export interface IWizardSetupFileAction {
  type: typeof WIZARD_SETUP_FILE;
  fileType: number;
  file: File | null;
}

// WIZARD_SETUP_PROGRESS

export interface IWizardSetupProgressAction {
  type: typeof WIZARD_SETUP_PROGRESS;
  fileType: number;
  progress: number;
}

// WIZARD_CONFIRM

export interface IWizardConfirmAction {
  type: typeof WIZARD_CONFIRM;
  apikey: string;
  contractId: string;
  file10: File | null;
  file20: File | null;
  file30: File | null;
}

export interface IWizardConfirmSuccessAction {
  type: typeof WIZARD_CONFIRM_SUCCESS;
}

export interface IWizardConfirmFailedAction {
  type: typeof WIZARD_CONFIRM_FAILED;
  errorText: string;
}

// WIZARD_CLEAR_ERROR

export interface IWizardClearErrorAction {
  type: typeof WIZARD_CLEAR_ERROR;
}

export type TAction =
  | IInit
  | ILoginAction
  | ILoginSuccessAction
  | ILoginFailedAction
  | ILogoutAction
  | ILogoutSuccessAction
  | ILogoutFailedAction
  | IUserClearErrorAction
  | IGetReportsAction
  | IGetReportsSuccessAction
  | IGetReportsFailedAction
  | ISetReportsAction
  | ISetReportsSuccessAction
  | ISetReportsFailedAction
  | IUpdReportsAction
  | IUpdReportsSuccessAction
  | IUpdReportsFailedAction
  | IDelReportsAction
  | IDelReportsSuccessAction
  | IDelReportsFailedAction
  | IConfirmAction
  | IConfirmSuccessAction
  | IConfirmFailedAction
  | IGetReportsFailedAction
  | IGetFilesAction
  | IGetFilesSuccessAction
  | IGetFilesFailedAction
  | ISetFilesAction
  | ISetFilesSuccessAction
  | ISetFilesFailedAction
  | IUpdFilesAction
  | IUpdFilesSuccessAction
  | IUpdFilesFailedAction
  | IDelFilesAction
  | IDelFilesSuccessAction
  | IDelFilesFailedAction
  | IFilesClearErrorAction
  | IFileUploadAction
  | IFileUploadSuccessAction
  | IFileUploadFailedAction
  | IFileDownloadAction
  | IFileDownloadSuccessAction
  | IFileDownloadFailedAction
  | IWizardSetupContractIdAction
  | IWizardSetupFileAction
  | IWizardSetupProgressAction
  | IWizardConfirmAction
  | IWizardConfirmSuccessAction
  | IWizardConfirmFailedAction
  | IWizardClearErrorAction
  | IGetContractsAction
  | IGetContractsSuccessAction
  | IGetContractsFailedAction
  | IContractsClearErrorAction
  | IReportsClearErrorAction;
