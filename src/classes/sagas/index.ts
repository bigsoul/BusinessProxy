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
  FILE_UPDATE_SUCCESS,
  FILE_UPLOAD_SUCCESS,
  FILE_UPLOAD_FAILED,
  IFileUploadFailedAction,
  IFileUploadAction,
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
import { resolve } from "dns";
import { reject } from "lodash";

function axiosAsync(method: string, requestData: TRequest) {
  const serviceUrl = "http://185.26.205.42:8086/do_demo/hs/BusinessProxy/";
  const serviceLogin = "exchange";
  const servicePassword = "exchange2016";

  return axios.post<TResponse>(serviceUrl + method, requestData, {
    auth: {
      username: serviceLogin,
      password: servicePassword,
    },
  });
}

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

function* workerLogin(action: ILoginAction) {
  try {
    const requestData: ILoginRequest = {
      login: action.userLogin,
      password: action.userPassword,
    };

    const responseData: ILoginResponse = (yield call(axiosAsync, "LoginIn", requestData)).data;
    if (!responseData.apikey) {
      throw new Error("Неверный логин или пароль.");
    }
    yield put<ILoginSuccessAction>({ type: LOGIN_SUCCESS, apikey: responseData.apikey, name: responseData.name });
    window._history.push("/contracts");
    yield put<IGetContractsAction>({ type: GET_CONTRACTS, apikey: responseData.apikey });
  } catch (err) {
    console.error(err.toString());
    yield put<ILoginFailedAction>({ type: LOGIN_FAILED, errorText: err.toString() });
  }
}

function* workerLogout(action: ILogoutAction) {
  try {
    const requestData: ILogoutRequest = {
      apikey: action.apikey,
    };

    const responseData: ILogoutResponse = (yield call(axiosAsync, "LoginOut", requestData)).data;

    if (!responseData.apikey) {
      yield put<ILogoutSuccessAction>({ type: LOGOUT_SUCCESS });
      window._history.push("/login");
    } else {
      throw new Error("Ошибка. Сервер сообщил о неудачной попытке выхода из системы.");
    }
  } catch (err) {
    console.error(err.toString());
    yield put<ILogoutFailedAction>({ type: LOGOUT_FAILED, errorText: err.toString() });
  }
}

function* workerGetContracts(action: IGetContractsAction) {
  try {
    const requestData: IGetContractsRequest = {
      apikey: action.apikey,
    };

    if (!requestData.apikey) {
      window._history.push("/login");
      return;
    }

    const responseData: IGetContractsResponse = (yield call(axiosAsync, "GetContracts", requestData)).data;

    yield put<IGetContractsSuccessAction>({ type: GET_CONTRACTS_SUCCESS, contracts: responseData.list });
  } catch (err) {
    console.error(err.toString());
    yield put<IGetContractsFailedAction>({ type: GET_CONTRACTS_FAILED, errorText: err.toString() });
  }
}

function* workerGetReports(action: IGetReportsAction) {
  try {
    const requestData: IGetReportsRequest = {
      apikey: action.apikey,
      contractId: action.contractId,
    };

    const responseData: IGetReportsResponse = (yield call(axiosAsync, "GetReports", requestData)).data;

    yield put<IGetReportsSuccessAction>({ type: GET_REPORTS_SUCCESS, reports: responseData.list });
  } catch (err) {
    console.error(err.toString());
    yield put<IGetReportsFailedAction>({ type: GET_REPORTS_FAILED, errorText: err.toString() });
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
    console.error(err.toString());
    yield put<ISetReportsFailedAction>({ type: SET_REPORTS_FAILED, errorText: err.toString() });
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
    console.error(err.toString());
    yield put<IUpdReportsFailedAction>({ type: UPD_REPORTS_FAILED, errorText: err.toString() });
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
    console.error(err.toString());
    yield put<IDelReportsFailedAction>({ type: DEL_REPORTS_FAILED, errorText: err.toString() });
  }
}

function* workerConfirm(action: IConfirmAction) {
  try {
    const requestData: IConfirmRequest = {
      apikey: action.apikey,
      reportsId: [action.reportId],
    };

    const responseData: IConfirmResponse = (yield call(axiosAsync, "Conform", requestData)).data;

    yield put<IConfirmSuccessAction>({ type: CONFIRM_SUCCESS, list: responseData.list });
  } catch (err) {
    console.error(err.toString());
    yield put<IConfirmFailedAction>({ type: CONFIRM_FAILED, errorText: err.toString() });
  }
}

function* workerGetFiles(action: IGetFilesAction) {
  try {
    const requestData: IGetFilesRequest = {
      apikey: action.apikey,
      reportId: action.reportId,
    };

    const responseData: IGetFilesResponse = (yield call(axiosAsync, "GetFiles", requestData)).data;

    yield put<IGetFilesSuccessAction>({ type: GET_FILES_SUCCESS, files: responseData.list });
  } catch (err) {
    console.error(err.toString());
    yield put<IGetFilesFailedAction>({ type: GET_FILES_FAILED, errorText: err.toString() });
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
    console.error(err.toString());
    yield put<ISetFilesFailedAction>({ type: SET_FILES_FAILED, errorText: err.toString() });
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
    console.error(err.toString());
    yield put<IUpdFilesFailedAction>({ type: UPD_FILES_FAILED, errorText: err.toString() });
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
    console.error(err.toString());
    yield put<IDelFilesFailedAction>({ type: DEL_FILES_FAILED, errorText: err.toString() });
  }
}

function* workerFileUpload(action: IFileUploadAction) {
  try {
    const requestData: IFileUploadRequest = yield call(fileReaderAsync, action);
    const responseData: IFileUploadResponse = (yield call(axiosAsync, "FileUpload", requestData)).data;

    yield put<IFileUploadSuccessAction>({ type: FILE_UPLOAD_SUCCESS, file: responseData.file });
  } catch (err) {
    console.error(err.toString());
    yield put<IFileUploadFailedAction>({ type: FILE_UPLOAD_FAILED, errorText: err.toString() });
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
}
