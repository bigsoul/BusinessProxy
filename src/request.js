export function login() {
  const inputLoginNode = document.getElementById("input-login");
  const inputPasswordNode = document.getElementById("input-password");

  let xhr = new XMLHttpRequest();

  let data = {
    login: inputLoginNode.value,
    password: inputPasswordNode.value,
  };

  let body = JSON.stringify(data);

  xhr.open(
    "POST",
    "http://185.26.205.42:8086/do_demo/hs/BusinessProxy/LoginIn",
    true,
    "exchange",
    "exchange2016"
  );

  xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
  xhr.setRequestHeader("Access-Control-Allow-Headers", "*");
  xhr.setRequestHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.withCredentials = true;

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      const response = JSON.parse(xhr.response);
      if (response.apikey !== "") {
        response.loginState = { state: 1 };
      } else {
        response.loginState = { state: 2 };
      }
      window.store.dispatch({ type: "LOGIN", response: response });
    }
  };

  xhr.send(body);
}

export function logout() {
  let xhr = new XMLHttpRequest();

  const state = window.store.getState();

  let data = { apikey: state.apikey };

  let body = JSON.stringify(data);

  xhr.open(
    "POST",
    "http://185.26.205.42:8086/do_demo/hs/BusinessProxy/LoginOut",
    true
  );

  xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
  xhr.setRequestHeader("Access-Control-Allow-Headers", "*");
  xhr.setRequestHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.withCredentials = false;

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      const response = JSON.parse(xhr.response);
      window.store.dispatch({ type: "LOGOUT", response: response });
    }
  };

  xhr.send(body);
}

export function fileUpload(e, rowData, contractId) {
  const inputNode = document.getElementById("upload-" + rowData.id);

  if (inputNode.files.length > 0) {
    const file = inputNode.files[0];

    inputNode.value = "";

    var reader = new FileReader();

    reader.onload = function (event) {
      const state = window.store.getState();
      let data = { apikey: state.apikey, id: rowData.id, name: file.name };
      let bodyJSON = JSON.stringify(data);

      const fileBuffer = event.target.result;

      const dataUint8 = new TextEncoder("utf-8").encode(bodyJSON);
      const fileUint8 = new Uint8Array(fileBuffer);

      const segmentSize = 4;

      let sendLength =
        segmentSize + dataUint8.byteLength + fileBuffer.byteLength;

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

      let xhr = new XMLHttpRequest();

      xhr.open(
        "POST",
        "http://185.26.205.42:8086/do_demo/hs/BusinessProxy/FileUpload",
        true
      );

      xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
      xhr.setRequestHeader("Access-Control-Allow-Headers", "*");
      xhr.setRequestHeader(
        "Access-Control-Allow-Methods",
        "POST, GET, OPTIONS"
      );
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

      xhr.withCredentials = false;

      xhr.send(sendUint8.buffer);

      xhr.onload = function () {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.response);
          window.store.dispatch({
            type: "FILE-UPDATE",
            contractId: contractId,
            newData: response,
          });
        } else {
          console.log("Загрузка файла на сервер закончилась неудачей.");
        }
      };
    };

    reader.onerror = function (event) {
      console.error(
        "Файл не может быть прочитан! код " + event.target.error.code
      );
    };

    reader.readAsArrayBuffer(file);
  } else {
    console.log("Файл не выбран !");
  }
}

export function contractRefresh(e) {
  let xhr = new XMLHttpRequest();

  const state = window.store.getState();

  let data = { apikey: state.apikey };

  let body = JSON.stringify(data);

  xhr.open(
    "POST",
    "http://185.26.205.42:8086/do_demo/hs/BusinessProxy/GetContracts",
    true
  );

  xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
  xhr.setRequestHeader("Access-Control-Allow-Headers", "*");
  xhr.setRequestHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.withCredentials = false;

  xhr.onload = function () {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.response);
      window.store.dispatch({ type: "UPDATE-CONTRACTS", contracts: response });
    } else {
      console.log("Не удалось выполнить обновление, ошибка.");
    }
  };

  xhr.send(body);
}

export function reportRefresh(e, contractId) {
  let xhr = new XMLHttpRequest();

  const state = window.store.getState();

  let data = { apikey: state.apikey, contractId: contractId };

  let body = JSON.stringify(data);

  xhr.open(
    "POST",
    "http://185.26.205.42:8086/do_demo/hs/BusinessProxy/GetReports",
    true
  );

  xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
  xhr.setRequestHeader("Access-Control-Allow-Headers", "*");
  xhr.setRequestHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.withCredentials = false;

  xhr.onload = function () {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.response);
      window.store.dispatch({
        type: "UPDATE-REPORTS",
        contractId: contractId,
        reports: response,
      });
    } else {
      console.log("Не удалось выполнить обновление, ошибка.");
    }
  };

  xhr.send(body);
}

export function setReports(id, contractId, name, state) {
  let xhr = new XMLHttpRequest();

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

  xhr.open(
    "POST",
    "http://185.26.205.42:8086/do_demo/hs/BusinessProxy/SetReports",
    true
  );

  xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
  xhr.setRequestHeader("Access-Control-Allow-Headers", "*");
  xhr.setRequestHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.withCredentials = false;

  xhr.onload = function () {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.response);
      window.store.dispatch({
        type: "REPORT-ADD",
        newData: response,
      });
    } else {
      console.log("Не удалось выполнить обновление, ошибка: " + xhr.status);
    }
  };

  xhr.onerror = function (e) {
    console.log("Не удалось создать отчет на сервере:" + e.target.status);
  };

  xhr.send(body);
}

export function delReports(id, contractId) {
  let xhr = new XMLHttpRequest();

  const _state = window.store.getState();

  let data = [
    {
      apikey: _state.apikey,
      id: id ? id : "",
      contractId: contractId,
    },
  ];

  let body = JSON.stringify(data);

  xhr.open(
    "POST",
    "http://185.26.205.42:8086/do_demo/hs/BusinessProxy/DelReports",
    true
  );

  xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
  xhr.setRequestHeader("Access-Control-Allow-Headers", "*");
  xhr.setRequestHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.withCredentials = false;

  xhr.onload = function () {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.response);
      window.store.dispatch({
        type: "REPORT-DELETE",
        dataDelete: response,
      });
    } else {
      console.log("Не удалось выполнить обновление, ошибка: " + xhr.status);
    }
  };

  xhr.onerror = function (e) {
    console.log("Не удалось создать отчет на сервере:" + e.target.status);
  };

  xhr.send(body);
}

export function updReports(id, contractId, newData) {
  let xhr = new XMLHttpRequest();

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

  xhr.open(
    "POST",
    "http://185.26.205.42:8086/do_demo/hs/BusinessProxy/UpdReports",
    true
  );

  xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
  xhr.setRequestHeader("Access-Control-Allow-Headers", "*");
  xhr.setRequestHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.withCredentials = false;

  xhr.onload = function () {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.response);
      window.store.dispatch({
        type: "REPORT-UPDATE",
        newData: response,
      });
    } else {
      console.log("Не удалось выполнить обновление, ошибка: " + xhr.status);
    }
  };

  xhr.onerror = function (e) {
    console.log("Не удалось создать отчет на сервере:" + e.target.status);
  };

  xhr.send(body);
}

export function getFiles(contractId, reportId) {
  let xhr = new XMLHttpRequest();

  const state = window.store.getState();

  let data = { apikey: state.apikey, reportId: reportId };

  let body = JSON.stringify(data);

  xhr.open(
    "POST",
    "http://185.26.205.42:8086/do_demo/hs/BusinessProxy/GetFiles",
    true
  );

  xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
  xhr.setRequestHeader("Access-Control-Allow-Headers", "*");
  xhr.setRequestHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.withCredentials = false;

  xhr.onload = function () {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.response);
      window.store.dispatch({
        type: "UPDATE-FILES",
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

export function setFiles(id, contractId, reportId, name) {
  let xhr = new XMLHttpRequest();

  const state = window.store.getState();

  let data = [
    {
      apikey: state.apikey,
      id: id ? id : "",
      reportId: reportId,
      name: name,
    },
  ];

  let body = JSON.stringify(data);

  xhr.open(
    "POST",
    "http://185.26.205.42:8086/do_demo/hs/BusinessProxy/SetFiles",
    true
  );

  xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
  xhr.setRequestHeader("Access-Control-Allow-Headers", "*");
  xhr.setRequestHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.withCredentials = false;

  xhr.onload = function () {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.response);
      window.store.dispatch({
        type: "FILE-ADD",
        contractId: contractId,
        newData: response,
      });
    } else {
      console.log("Не удалось выполнить обновление, ошибка: " + xhr.status);
    }
  };

  xhr.onerror = function (e) {
    console.log("Не удалось создать файл на сервере:" + e.target.status);
  };

  xhr.send(body);
}

export function updFiles(id, contractId, reportId, name) {
  let xhr = new XMLHttpRequest();

  const _state = window.store.getState();

  let data = [
    {
      apikey: _state.apikey,
      id: id ? id : "",
      reportId: reportId,
      name: name,
    },
  ];

  let body = JSON.stringify(data);

  xhr.open(
    "POST",
    "http://185.26.205.42:8086/do_demo/hs/BusinessProxy/UpdFiles",
    true
  );

  xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
  xhr.setRequestHeader("Access-Control-Allow-Headers", "*");
  xhr.setRequestHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.withCredentials = false;

  xhr.onload = function () {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.response);
      window.store.dispatch({
        type: "FILE-UPDATE",
        contractId: contractId,
        newData: response,
      });
    } else {
      console.log("Не удалось выполнить обновление, ошибка: " + xhr.status);
    }
  };

  xhr.onerror = function (e) {
    console.log("Не удалось создать файл на сервере:" + e.target.status);
  };

  xhr.send(body);
}

export function delFiles(id, contractId, reportId) {
  let xhr = new XMLHttpRequest();

  const state = window.store.getState();

  let data = [
    {
      apikey: state.apikey,
      id: id ? id : "",
      reportId: reportId,
    },
  ];

  let body = JSON.stringify(data);

  xhr.open(
    "POST",
    "http://185.26.205.42:8086/do_demo/hs/BusinessProxy/DelFiles",
    true
  );

  xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
  xhr.setRequestHeader("Access-Control-Allow-Headers", "*");
  xhr.setRequestHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.withCredentials = false;

  xhr.onload = function () {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.response);
      window.store.dispatch({
        type: "FILE-DELETE",
        contractId: contractId,
        dataDelete: response,
      });
    } else {
      console.log("Не удалось выполнить обновление, ошибка: " + xhr.status);
    }
  };

  xhr.onerror = function (e) {
    console.log("Не удалось создать файл на сервере:" + e.target.status);
  };

  xhr.send(body);
}
