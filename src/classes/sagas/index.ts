import { takeEvery, put, call } from "redux-saga/effects";
import {
  LOGIN,
  REPORT_CURRENT_SET,
  IReportCurrentSetAction,
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
} from "./../../types/TAction";
import { contractRefresh, reportRefresh } from "../Requests";
import { ILoginRequest, TRequest, IGetContractsRequest, ILogoutRequest } from "./../../interfaces/IRequest";
import { ILoginResponse, TResponse, IGetContractsResponse, ILogoutResponse } from "./../../interfaces/IResponse";
import axios from "axios";

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

    yield put<IGetContractsSuccessAction>({ type: GET_CONTRACTS_SUCCESS, contracts: responseData });
  } catch (err) {
    yield put<IGetContractsFailedAction>({ type: GET_CONTRACTS_FAILED, errorText: err.toString() });
  }
}

function* workerReportCurrentSet(action: IReportCurrentSetAction) {
  yield reportRefresh(action.contractId);
}

export function* watchLogin() {
  yield takeEvery(LOGIN, workerLogin);
  yield takeEvery(LOGOUT, workerLogout);
  yield takeEvery(GET_CONTRACTS, workerGetContracts);
  yield takeEvery(REPORT_CURRENT_SET, workerReportCurrentSet);
}
