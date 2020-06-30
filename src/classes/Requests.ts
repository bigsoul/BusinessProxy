import {
  ILoginAction,
  ILogoutAction,
  LOGIN,
  LOGOUT,
  FILE_UPDATE,
  IFileUpdateAction,
  UPDATE_CONTRACTS,
  IUpdateContractsAction,
  UPDATE_REPORTS,
  IUpdateReportsAction,
  REPORT_ADD,
  IReportAddAction,
  REPORT_DELETE,
  IReportDeleteAction,
  REPORT_UPDATE,
  IReportUpdateAction,
  UPDATE_FILES,
  IUpdateFilesAction,
  FILE_ADD,
  IFileAddAction,
  IFileDeleteAction,
  FILE_DELETE,
} from "../types/TAction";
import IFile from "../interfaces/IFile";
import IReport from "../interfaces/IReport";

var _login = "exchange";
var _password = "exchange2016";
var _url = "http://185.26.205.42:8086/do_demo/hs/BusinessProxy/";

function getXhr(method: string) {
  let xhr = new XMLHttpRequest();

  xhr.open("POST", _url + method, true, _login, _password);

  xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
  xhr.setRequestHeader("Access-Control-Allow-Headers", "*");
  xhr.setRequestHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.withCredentials = true;

  return xhr;
}

export function login(login: string, password: string): void {
  let data = {
    login,
    password,
  };

  let body = JSON.stringify(data);

  const xhr = getXhr("LoginIn");

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      const response = JSON.parse(xhr.response);
      if (response.apikey !== "") {
        response.loginState = { state: 1 };
      } else {
        response.loginState = { state: 2 };
      }
      window.store.dispatch<ILoginAction>({ type: LOGIN, response: response });
    }
  };

  xhr.send(body);
}

export function logout(): void {
  const state = window.store.getState();

  let data = { apikey: state.apikey };

  let body = JSON.stringify(data);

  const xhr = getXhr("LoginOut");

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      const response = JSON.parse(xhr.response);
      window.store.dispatch<ILogoutAction>({ type: LOGOUT, response: response });
    }
  };

  xhr.send(body);
}

export function fileUpload(files: FileList, rowData: IFile, contractId: string, isOriginal: boolean): void {
  const file = files[0];

  var reader = new FileReader();

  reader.onload = function (event) {
    const state = window.store.getState();

    let data = {
      apikey: state.apikey,
      id: rowData.id,
      name: file.name,
      isOriginal: isOriginal,
    };

    let bodyJSON = JSON.stringify(data);

    const fileBuffer = event.target?.result;

    if (!event.target || !fileBuffer || typeof fileBuffer === "string") {
      console.log("Ошибка загрузки файла на стороне клиента.");
      return;
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

    const xhr = getXhr("FileUpload");

    xhr.send(sendUint8.buffer);

    xhr.onload = function () {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.response);
        window.store.dispatch<IFileUpdateAction>({
          type: FILE_UPDATE,
          contractId: contractId,
          newData: response,
        });
      } else {
        console.log("Загрузка файла на сервер закончилась неудачей.");
      }
    };
  };

  reader.onerror = function (e) {
    let code: number | null = null;

    if (e.target?.error?.code) code = e.target.error.code;

    console.error("Файл не может быть прочитан! код [" + code + "]");
  };

  reader.readAsArrayBuffer(file);
}

export function fileDownload(rowData: IFile): void {}

export function contractRefresh(): void {
  const state = window.store.getState();

  let data = { apikey: state.apikey };

  let body = JSON.stringify(data);

  const xhr = getXhr("GetContracts");

  xhr.onload = function () {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.response);
      window.store.dispatch<IUpdateContractsAction>({ type: UPDATE_CONTRACTS, contracts: response });
    } else {
      console.log("Не удалось выполнить обновление, ошибка.");
    }
  };

  xhr.send(body);
}

export function reportRefresh(contractId: string): void {
  const state = window.store.getState();

  let data = { apikey: state.apikey, contractId: contractId };

  let body = JSON.stringify(data);

  const xhr = getXhr("GetReports");

  xhr.onload = function () {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.response);
      window.store.dispatch<IUpdateReportsAction>({
        type: UPDATE_REPORTS,
        contractId: contractId,
        reports: response,
      });
    } else {
      console.log("Не удалось выполнить обновление, ошибка.");
    }
  };

  xhr.send(body);
}

export function setReports(id: string, contractId: string, name: string, state: string): void {
  const _state = window.store.getState();

  let data = [
    {
      apikey: _state.apikey,
      id: id ? id : "",
      contractId: contractId,
      name: name,
      state: state,
    },
  ];

  let body = JSON.stringify(data);

  const xhr = getXhr("SetReports");

  xhr.onload = function () {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.response);
      window.store.dispatch<IReportAddAction>({
        type: REPORT_ADD,
        newData: response,
      });
    } else {
      console.log("Не удалось выполнить обновление, ошибка: " + xhr.status);
    }
  };

  xhr.onerror = function () {
    console.log("Не удалось создать отчет на сервере:" + xhr.status);
  };

  xhr.send(body);
}

export function delReports(id: string, contractId: string): void {
  const _state = window.store.getState();

  let data = [
    {
      apikey: _state.apikey,
      id: id ? id : "",
      contractId: contractId,
    },
  ];

  let body = JSON.stringify(data);

  const xhr = getXhr("DelReports");

  xhr.onload = function () {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.response);
      window.store.dispatch<IReportDeleteAction>({
        type: REPORT_DELETE,
        dataDelete: response,
      });
    } else {
      console.log("Не удалось выполнить обновление, ошибка: " + xhr.status);
    }
  };

  xhr.onerror = function (e) {
    console.log("Не удалось создать отчет на сервере:" + xhr.status);
  };

  xhr.send(body);
}

export function updReports(id: string, contractId: string, newData: IReport): void {
  const _state = window.store.getState();

  let data = [
    {
      apikey: _state.apikey,
      id: id ? id : "",
      contractId: contractId,
      name: newData.name,
    },
  ];

  let body = JSON.stringify(data);

  const xhr = getXhr("UpdReports");

  xhr.onload = function () {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.response);
      window.store.dispatch<IReportUpdateAction>({
        type: REPORT_UPDATE,
        newData: response,
      });
    } else {
      console.log("Не удалось выполнить обновление, ошибка: " + xhr.status);
    }
  };

  xhr.onerror = function () {
    console.log("Не удалось создать отчет на сервере:" + xhr.status);
  };

  xhr.send(body);
}

export function getFiles(contractId: string, reportId: string): void {
  const state = window.store.getState();

  let data = { apikey: state.apikey, reportId: reportId };

  let body = JSON.stringify(data);

  const xhr = getXhr("GetFiles");

  xhr.onload = function () {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.response);
      window.store.dispatch<IUpdateFilesAction>({
        type: UPDATE_FILES,
        contractId: contractId,
        reportId: reportId,
        files: response,
      });
    } else {
      console.log("Не удалось выполнить обновление, ошибка.");
    }
  };

  xhr.send(body);
}

export function setFiles(id: string, contractId: string, reportId: string, name: string, type: number): void {
  const state = window.store.getState();

  let data = [
    {
      apikey: state.apikey,
      id: id ? id : "",
      reportId: reportId,
      name: name,
      type: type ? type : 0,
    },
  ];

  let body = JSON.stringify(data);

  const xhr = getXhr("SetFiles");

  xhr.onload = function () {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.response);
      window.store.dispatch<IFileAddAction>({
        type: FILE_ADD,
        contractId: contractId,
        newData: response,
      });
    } else {
      console.log("Не удалось выполнить обновление, ошибка: " + xhr.status);
    }
  };

  xhr.onerror = function () {
    console.log("Не удалось создать файл на сервере:" + xhr.status);
  };

  xhr.send(body);
}

export function updFiles(id: string, contractId: string, reportId: string, name: string, type: number) {
  const _state = window.store.getState();

  let data = [
    {
      apikey: _state.apikey,
      id: id ? id : "",
      reportId: reportId,
      name: name,
      type: type,
    },
  ];

  let body = JSON.stringify(data);

  const xhr = getXhr("UpdFiles");

  xhr.onload = function () {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.response);
      window.store.dispatch<IFileUpdateAction>({
        type: FILE_UPDATE,
        contractId: contractId,
        newData: response,
      });
    } else {
      console.log("Не удалось выполнить обновление, ошибка: " + xhr.status);
    }
  };

  xhr.onerror = function () {
    console.log("Не удалось создать файл на сервере:" + xhr.status);
  };

  xhr.send(body);
}

export function delFiles(id: string, contractId: string, reportId: string): void {
  const state = window.store.getState();

  let data = [
    {
      apikey: state.apikey,
      id: id ? id : "",
      reportId: reportId,
    },
  ];

  let body = JSON.stringify(data);

  const xhr = getXhr("DelFiles");

  xhr.onload = function () {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.response);
      window.store.dispatch<IFileDeleteAction>({
        type: FILE_DELETE,
        contractId: contractId,
        dataDelete: response,
      });
    } else {
      console.log("Не удалось выполнить обновление, ошибка: " + xhr.status);
    }
  };

  xhr.onerror = function (e) {
    console.log("Не удалось создать файл на сервере:" + xhr.status);
  };

  xhr.send(body);
}

export function conform(reportId: string, isOriginal: boolean): void {
  const state = window.store.getState();

  let data = [
    {
      apikey: state.apikey,
      reportId: reportId,
      isOriginal: isOriginal,
    },
  ];

  let body = JSON.stringify(data);

  const xhr = getXhr("Conform");

  xhr.onload = function () {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.response);
      window.store.dispatch<IReportUpdateAction>({
        type: REPORT_UPDATE,
        newData: response,
      });
    } else {
      console.log("Не удалось выполнить обновление, ошибка: " + xhr.status);
    }
  };

  xhr.onerror = function (e) {
    console.log("Не удалось создать отчет на сервере:" + xhr.status);
  };

  xhr.send(body);
}
