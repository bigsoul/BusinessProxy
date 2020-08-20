import { takeEvery, put, call } from "redux-saga/effects";
import {
  LOGIN,
  GET_REPORTS,
  ILoginAction,
  ILogoutSuccessAction,
  ILogoutFailedAction,
  LOGIN_SUCCESS,
  LOGIN_FAILED,
  ILoginSuccessAction,
  ILoginFailedAction,
  IGetContractsAction,
  GET_CONTRACTS,
  IGetContractsSuccessAction,
  GET_CONTRACTS_SUCCESS,
  IGetContractsFailedAction,
  GET_CONTRACTS_FAILED,
  ILogoutAction,
  LOGOUT,
  LOGOUT_SUCCESS,
  LOGOUT_FAILED,
  IGetReportsAction,
  IGetReportsSuccessAction,
  IGetReportsFailedAction,
  GET_REPORTS_SUCCESS,
  GET_REPORTS_FAILED,
  SET_REPORTS,
  ISetReportsAction,
  ISetReportsSuccessAction,
  SET_REPORTS_SUCCESS,
  ISetReportsFailedAction,
  SET_REPORTS_FAILED,
  IUpdReportsAction,
  UPD_REPORTS,
  IUpdReportsSuccessAction,
  UPD_REPORTS_SUCCESS,
  IUpdReportsFailedAction,
  UPD_REPORTS_FAILED,
  IDelReportsAction,
  DEL_REPORTS,
  IDelReportsSuccessAction,
  DEL_REPORTS_SUCCESS,
  IDelReportsFailedAction,
  DEL_REPORTS_FAILED,
  IGetFilesAction,
  IGetFilesSuccessAction,
  IGetFilesFailedAction,
  GET_FILES_SUCCESS,
  GET_FILES_FAILED,
  GET_FILES,
  IConfirmAction,
  CONFIRM,
  IConfirmSuccessAction,
  IConfirmFailedAction,
  CONFIRM_FAILED,
  CONFIRM_SUCCESS,
  ISetFilesAction,
  IUpdFilesAction,
  IDelFilesAction,
  ISetFilesFailedAction,
  ISetFilesSuccessAction,
  SET_FILES_SUCCESS,
  SET_FILES_FAILED,
  IUpdFilesSuccessAction,
  IUpdFilesFailedAction,
  UPD_FILES_SUCCESS,
  UPD_FILES_FAILED,
  IDelFilesSuccessAction,
  IDelFilesFailedAction,
  DEL_FILES_SUCCESS,
  DEL_FILES_FAILED,
  SET_FILES,
  UPD_FILES,
  DEL_FILES,
  FILE_UPLOAD,
  IFileUploadSuccessAction,
  FILE_UPLOAD_SUCCESS,
  FILE_UPLOAD_FAILED,
  IFileUploadFailedAction,
  IFileUploadAction,
  IWizardConfirmAction,
  WIZARD_CONFIRM,
  IWizardConfirmSuccessAction,
  IWizardConfirmFailedAction,
  WIZARD_CONFIRM_SUCCESS,
  WIZARD_CONFIRM_FAILED,
  IWizardSetupProgressAction,
  WIZARD_SETUP_PROGRESS,
} from "./../../types/TAction";
import {
  ILoginRequest,
  TRequest,
  IGetContractsRequest,
  ILogoutRequest,
  IGetReportsRequest,
  ISetReportsRequest,
  IUpdReportsRequest,
  IDelReportsRequest,
  IGetFilesRequest,
  IConfirmRequest,
  ISetFilesRequest,
  IUpdFilesRequest,
  IDelFilesRequest,
  IFileUploadRequest,
} from "./../../interfaces/IRequest";
import {
  ILoginResponse,
  TResponse,
  IGetContractsResponse,
  ILogoutResponse,
  IGetReportsResponse,
  ISetReportsResponse,
  IUpdReportsResponse,
  IDelReportsResponse,
  IGetFilesResponse,
  IConfirmResponse,
  ISetFilesResponse,
  IUpdFilesResponse,
  IDelFilesResponse,
  IFileUploadResponse,
} from "./../../interfaces/IResponse";
import axios from "axios";
import moment from "moment";

// net

function axiosAsync(method: string, requestData: TRequest, onUploadProgress: any = undefined) {
  const origin = window.location.origin === "http://localhost:3000" ? "http://185.26.205.42:8086" : window.location.origin;
  let serviceUrl = origin + "/do_demo/hs/BusinessProxy/";

  if (process.env.NODE_ENV === "production" && origin !== "http://185.26.205.42:8086") {
    serviceUrl = "/do/hs/BusinessProxy/";
  }

  const serviceLogin = "exchange";
  const servicePassword = "exchange2016";

  return axios.post<TResponse>(serviceUrl + method, requestData, {
    auth: {
      username: serviceLogin,
      password: servicePassword,
    },
    onUploadProgress: onUploadProgress,
  });
}

// IO

function fileReaderAsync(action: IFileUploadAction) {
  return new Promise<ArrayBufferLike>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = function (event) {
      try {
        let data = {
          apikey: action.apikey,
          id: action.id,
          name: action.name,
        };

        let bodyJSON = JSON.stringify(data);

        const fileBuffer = event.target?.result;

        if (!event.target || !fileBuffer || typeof fileBuffer === "string") {
          throw new Error("File download error on client side.");
        }

        const dataUint8 = new TextEncoder().encode(bodyJSON);
        const fileUint8 = new Uint8Array(fileBuffer);

        const segmentSize = 4;

        let sendLength = segmentSize + dataUint8.byteLength + fileBuffer.byteLength;

        const balance = sendLength % segmentSize;
        let balanseDiff = 0;

        if (balance > 0) {
          balanseDiff = segmentSize - balance;
          sendLength += balanseDiff;
        }

        const sendBuffer = new ArrayBuffer(sendLength);

        const sendUint32 = new Uint32Array(sendBuffer);
        const sendUint8 = new Uint8Array(sendBuffer);

        sendUint32[0] = dataUint8.byteLength + segmentSize + balanseDiff;

        sendUint8.set(dataUint8, segmentSize);
        sendUint8.set(fileUint8, dataUint8.length + segmentSize + balanseDiff);

        resolve(sendUint8.buffer);
      } catch (err) {
        reject(new Error("File download error: " + err.toString()));
      }
    };

    reader.onerror = function (event) {
      try {
        let code: number | null = null;

        if (event.target?.error?.code) code = event.target.error.code;

        reject(new Error("File download error code: [" + code + "]"));
      } catch (err) {
        reject(new Error("File download error: " + err.toString()));
      }
    };

    reader.readAsArrayBuffer(action.file);
  });
}

//

function getFileUploadProgress(fileType: number) {
  return function (progressEvent: any) {
    if (!progressEvent) return;
    window.store.dispatch<IWizardSetupProgressAction>({
      type: WIZARD_SETUP_PROGRESS,
      fileType: fileType,
      progress: Math.round((progressEvent.loaded * 100) / progressEvent.total),
    });
  };
}

function getUserError(err: any): string {
  const serverError = err?.response?.data?.errorText;
  const userError = serverError ? serverError : err.message;

  console.error(userError);

  return userError;
}

// auth

function* workerLogin(action: ILoginAction) {
  try {
    const requestData: ILoginRequest = {
      login: action.userLogin,
      password: action.userPassword,
    };

    const responseData: ILoginResponse = (yield call(axiosAsync, "LoginIn", requestData)).data;

    localStorage.setItem("apikey", responseData.apikey);
    localStorage.setItem("name", responseData.name);

    yield put<ILoginSuccessAction>({ type: LOGIN_SUCCESS, apikey: responseData.apikey, name: responseData.name });
    window._history.push(`${window.homepage}/contracts`);
  } catch (err) {
    yield put<ILoginFailedAction>({ type: LOGIN_FAILED, errorText: getUserError(err) });
  }
}

function* workerLogout(action: ILogoutAction) {
  try {
    const requestData: ILogoutRequest = {
      apikey: action.apikey,
    };

    const responseData: ILogoutResponse = (yield call(axiosAsync, "LoginOut", requestData)).data;

    if (!responseData.apikey) {
      localStorage.clear();

      yield put<ILogoutSuccessAction>({ type: LOGOUT_SUCCESS });
      window._history.push(`${window.homepage}/login`);
    } else {
      throw new Error("Ошибка. Сервер сообщил о неудачной попытке выхода из системы.");
    }
  } catch (err) {
    yield put<ILogoutFailedAction>({ type: LOGOUT_FAILED, errorText: getUserError(err) });
  }
}

// contracts

function* workerGetContracts(action: IGetContractsAction) {
  try {
    const requestData: IGetContractsRequest = {
      apikey: action.apikey,
    };

    if (!requestData.apikey) {
      window._history.push(`${window.homepage}/login`);
      return;
    }

    const responseData: IGetContractsResponse = (yield call(axiosAsync, "GetContracts", requestData)).data;

    yield put<IGetContractsSuccessAction>({ type: GET_CONTRACTS_SUCCESS, contracts: responseData.list });
  } catch (err) {
    yield put<IGetContractsFailedAction>({ type: GET_CONTRACTS_FAILED, errorText: getUserError(err) });
  }
}

// reports

function* workerGetReports(action: IGetReportsAction) {
  try {
    const requestData: IGetReportsRequest = {
      apikey: action.apikey,
      contractId: action.contractId,
    };

    const responseData: IGetReportsResponse = (yield call(axiosAsync, "GetReports", requestData)).data;

    yield put<IGetReportsSuccessAction>({ type: GET_REPORTS_SUCCESS, reports: responseData.list });
  } catch (err) {
    yield put<IGetReportsFailedAction>({ type: GET_REPORTS_FAILED, errorText: getUserError(err) });
  }
}

function* workerSetReports(action: ISetReportsAction) {
  try {
    const requestData: ISetReportsRequest = {
      apikey: action.apikey,
      list: action.list,
    };

    const responseData: ISetReportsResponse = (yield call(axiosAsync, "SetReports", requestData)).data;

    yield put<ISetReportsSuccessAction>({ type: SET_REPORTS_SUCCESS, list: responseData.list });
  } catch (err) {
    yield put<ISetReportsFailedAction>({ type: SET_REPORTS_FAILED, errorText: getUserError(err) });
  }
}

function* workerUpdReports(action: IUpdReportsAction) {
  try {
    const requestData: IUpdReportsRequest = {
      apikey: action.apikey,
      list: action.list,
    };

    const responseData: IUpdReportsResponse = (yield call(axiosAsync, "UpdReports", requestData)).data;

    yield put<IUpdReportsSuccessAction>({ type: UPD_REPORTS_SUCCESS, list: responseData.list });
  } catch (err) {
    yield put<IUpdReportsFailedAction>({ type: UPD_REPORTS_FAILED, errorText: getUserError(err) });
  }
}

function* workerDelReports(action: IDelReportsAction) {
  try {
    const requestData: IDelReportsRequest = {
      apikey: action.apikey,
      list: action.list,
    };

    const responseData: IDelReportsResponse = (yield call(axiosAsync, "DelReports", requestData)).data;

    yield put<IDelReportsSuccessAction>({ type: DEL_REPORTS_SUCCESS, list: responseData.list });
  } catch (err) {
    yield put<IDelReportsFailedAction>({ type: DEL_REPORTS_FAILED, errorText: getUserError(err) });
  }
}

// confirm

function* workerConfirm(action: IConfirmAction) {
  try {
    const requestData: IConfirmRequest = {
      apikey: action.apikey,
      reportsId: [action.reportId],
    };

    const responseData: IConfirmResponse = (yield call(axiosAsync, "Conform", requestData)).data;

    yield put<IConfirmSuccessAction>({ type: CONFIRM_SUCCESS, list: responseData.list });
  } catch (err) {
    yield put<IConfirmFailedAction>({ type: CONFIRM_FAILED, errorText: getUserError(err) });
  }
}

// files

function* workerGetFiles(action: IGetFilesAction) {
  try {
    const requestData: IGetFilesRequest = {
      apikey: action.apikey,
      reportId: action.reportId,
    };

    const responseData: IGetFilesResponse = (yield call(axiosAsync, "GetFiles", requestData)).data;

    yield put<IGetFilesSuccessAction>({ type: GET_FILES_SUCCESS, files: responseData.list });
  } catch (err) {
    yield put<IGetFilesFailedAction>({ type: GET_FILES_FAILED, errorText: getUserError(err) });
  }
}

function* workerSetFiles(action: ISetFilesAction) {
  try {
    const requestData: ISetFilesRequest = {
      apikey: action.apikey,
      list: action.list,
    };

    const responseData: ISetFilesResponse = (yield call(axiosAsync, "SetFiles", requestData)).data;

    yield put<ISetFilesSuccessAction>({ type: SET_FILES_SUCCESS, list: responseData.list });
  } catch (err) {
    yield put<ISetFilesFailedAction>({ type: SET_FILES_FAILED, errorText: getUserError(err) });
  }
}

function* workerUpdFiles(action: IUpdFilesAction) {
  try {
    const requestData: IUpdFilesRequest = {
      apikey: action.apikey,
      list: action.list,
    };

    const responseData: IUpdFilesResponse = (yield call(axiosAsync, "UpdFiles", requestData)).data;

    yield put<IUpdFilesSuccessAction>({ type: UPD_FILES_SUCCESS, list: responseData.list });
  } catch (err) {
    yield put<IUpdFilesFailedAction>({ type: UPD_FILES_FAILED, errorText: getUserError(err) });
  }
}

function* workerDelFiles(action: IDelFilesAction) {
  try {
    const requestData: IDelFilesRequest = {
      apikey: action.apikey,
      list: action.list,
    };

    const responseData: IDelFilesResponse = (yield call(axiosAsync, "DelFiles", requestData)).data;

    yield put<IDelFilesSuccessAction>({ type: DEL_FILES_SUCCESS, list: responseData.list });
  } catch (err) {
    yield put<IDelFilesFailedAction>({ type: DEL_FILES_FAILED, errorText: getUserError(err) });
  }
}

function* workerFileUpload(action: IFileUploadAction) {
  try {
    const requestData: IFileUploadRequest = yield call(fileReaderAsync, action);
    const responseData: IFileUploadResponse = (yield call(axiosAsync, "FileUpload", requestData)).data;

    yield put<IFileUploadSuccessAction>({ type: FILE_UPLOAD_SUCCESS, file: responseData.file });
  } catch (err) {
    yield put<IFileUploadFailedAction>({ type: FILE_UPLOAD_FAILED, errorText: getUserError(err) });
  }
}

// wizard

function* workerWizardConfirm(action: IWizardConfirmAction) {
  try {
    if (!action.file10) throw Error("Не выбран файл КС2");
    if (!action.file20) throw Error("Не выбран файл КС3");
    if (!action.file30) throw Error("Не выбран файл исп. документации");
    if (!action.contractId) throw Error("Internal error: contract id is empty.");

    const requestReports: ISetReportsRequest = {
      apikey: action.apikey,
      list: [
        {
          id: "",
          name: "Отчет от " + moment().format().substr(0, 10),
          state: "Новый",
          files: [],
          contractId: action.contractId,
        },
      ],
    };

    const responseReports: ISetReportsResponse = (yield call(axiosAsync, "SetReports", requestReports)).data;

    if (responseReports.errorText) throw Error(responseReports.errorText);

    const requestFiles: ISetFilesRequest = {
      apikey: action.apikey,
      list: [
        { id: "", name: action.file10.name, type: 10, loaded: false, reportId: responseReports.list[0].id },
        { id: "", name: action.file20.name, type: 20, loaded: false, reportId: responseReports.list[0].id },
        { id: "", name: action.file30.name, type: 30, loaded: false, reportId: responseReports.list[0].id },
      ],
    };

    const responseFiles: ISetFilesResponse = (yield call(axiosAsync, "SetFiles", requestFiles)).data;

    if (responseFiles.errorText) throw Error(responseFiles.errorText);

    const file10Action: IFileUploadAction = {
      type: FILE_UPLOAD,
      apikey: action.apikey,
      id: responseFiles.list[0].id,
      name: action.file10.name,
      file: action.file10,
    };

    const requestFile10: IFileUploadRequest = yield call(fileReaderAsync, file10Action);
    yield call(axiosAsync, "FileUpload", requestFile10, getFileUploadProgress(10));
    //const responseFile10: IFileUploadResponse = (yield call(axiosAsync, "FileUpload", requestFile10)).data;

    const file20Action: IFileUploadAction = {
      type: FILE_UPLOAD,
      apikey: action.apikey,
      id: responseFiles.list[1].id,
      name: action.file20.name,
      file: action.file20,
    };

    const requestFile20: IFileUploadRequest = yield call(fileReaderAsync, file20Action);
    yield call(axiosAsync, "FileUpload", requestFile20, getFileUploadProgress(20));
    //const responseFile20: IFileUploadResponse = (yield call(axiosAsync, "FileUpload", requestFile20)).data;

    const file30Action: IFileUploadAction = {
      type: FILE_UPLOAD,
      apikey: action.apikey,
      id: responseFiles.list[2].id,
      name: action.file30.name,
      file: action.file30,
    };

    const requestFile30: IFileUploadRequest = yield call(fileReaderAsync, file30Action);
    yield call(axiosAsync, "FileUpload", requestFile30, getFileUploadProgress(30));
    //const responseFile30: IFileUploadResponse = (yield call(axiosAsync, "FileUpload", requestFile30)).data;

    const requestData: IConfirmRequest = {
      apikey: action.apikey,
      reportsId: [responseReports.list[0].id],
    };

    yield call(axiosAsync, "Conform", requestData);

    yield put<IWizardConfirmSuccessAction>({ type: WIZARD_CONFIRM_SUCCESS });
  } catch (err) {
    yield put<IWizardConfirmFailedAction>({ type: WIZARD_CONFIRM_FAILED, errorText: getUserError(err) });
  }
}

export function* watchLogin() {
  yield takeEvery(LOGIN, workerLogin);
  yield takeEvery(LOGOUT, workerLogout);
  yield takeEvery(GET_CONTRACTS, workerGetContracts);
  yield takeEvery(GET_REPORTS, workerGetReports);
  yield takeEvery(SET_REPORTS, workerSetReports);
  yield takeEvery(UPD_REPORTS, workerUpdReports);
  yield takeEvery(DEL_REPORTS, workerDelReports);
  yield takeEvery(CONFIRM, workerConfirm);
  yield takeEvery(GET_FILES, workerGetFiles);
  yield takeEvery(SET_FILES, workerSetFiles);
  yield takeEvery(UPD_FILES, workerUpdFiles);
  yield takeEvery(DEL_FILES, workerDelFiles);
  yield takeEvery(FILE_UPLOAD, workerFileUpload);
  yield takeEvery(WIZARD_CONFIRM, workerWizardConfirm);
}
