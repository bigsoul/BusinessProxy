import "typeface-roboto";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import "./index.css";
import App from "./App";
import { contractRefresh, reportRefresh, getFiles } from "./classes/requests";

const initState = () => {
  return {
    apikey: "",
    name: "",
    loginState: { state: 0 },
    files: null,
    reportId: null,
    reports: null,
    contractId: null,
    contracts: [
      /*{
        id: "665be996-5677-4a33-8ba0-de6857cfffe1",
        name: "Договор 1",
        state: "На согласовании",
        reports: [
          {
            id: "73025e53-f30d-47cc-b6b2-d09591243e0c",
            contractId: "665be996-5677-4a33-8ba0-de6857cfffe1",
            name: "Отчет 1",
            state: "Согласован",
            files: [
              {
                id: "173dbd54-46db-40eb-a6e6-7b03a2b2022a",
                raportId: "73025e53-f30d-47cc-b6b2-d09591243e0c",
                contractId: "665be996-5677-4a33-8ba0-de6857cfffe1",
                type: "",
                loaded: true,
                name: "Файл 1",
              },
              {
                id: "3f4e1283-c86f-47b8-bde5-b998eabdbcba",
                raportId: "73025e53-f30d-47cc-b6b2-d09591243e0c",
                contractId: "665be996-5677-4a33-8ba0-de6857cfffe1",
                type: "",
                loaded: false,
                name: "Файл 2",
              },
            ],
          },
          {
            id: "a4dafb57-c788-426e-bcd7-266467f3d4b4",
            contractId: "665be996-5677-4a33-8ba0-de6857cfffe1",
            name: "Отчет 2",
            state: "На согласовании",
            files: [
              {
                id: "2b18834a-2c80-4831-96f4-2746e20daf66",
                raportId: "a4dafb57-c788-426e-bcd7-266467f3d4b4",
                contractId: "665be996-5677-4a33-8ba0-de6857cfffe1",
                type: "",
                loaded: true,
                name: "Файл 1",
              },
              {
                id: "456df632-b22e-4f5c-837e-af7d93e04b80",
                raportId: "a4dafb57-c788-426e-bcd7-266467f3d4b4",
                contractId: "665be996-5677-4a33-8ba0-de6857cfffe1",
                type: "",
                loaded: false,
                name: "Файл 2",
              },
            ],
          },
        ],
      },*/
    ],
  };
};

const reducer = (curState = initState(), action) => {
  switch (action.type) {
    case "LOGIN": {
      const newState = {
        ...curState,
        apikey: action.response.apikey,
        name: action.response.name,
        loginState: {
          ...curState.loginState,
          state: action.response.loginState.state,
        },
      };
      setTimeout(contractRefresh, 0);
      return newState;
    }
    case "LOGOUT": {
      const newState = {
        ...curState,
        apikey: action.response.apikey,
        name: action.response.name,
      };
      return newState;
    }
    case "REPORT-ADD": {
      const newData = action.newData[0];

      const contract = getContractById(curState.contracts, newData.contractId);
      const newState = {
        ...curState,
      };
      newState.contracts.forEach((element) => {
        if (element.id === contract.id) {
          element.reports = [...element.reports];
          element.reports.push({
            id: newData.id,
            contractId: newData.contractId,
            name: newData.name,
            state: newData.state,
            files: [],
          });
        }
      });
      return reducerReportCurrentSet(newState, contract.id);
    }
    case "REPORT-UPDATE": {
      const newData = action.newData[0];

      const contract = getContractById(curState.contracts, newData.contractId);
      const newState = {
        ...curState,
      };
      newState.contracts.forEach((contr) => {
        if (contr.id === contract.id) {
          contr.reports = [...contr.reports];
          contr.reports.forEach((rep) => {
            if (rep.id === newData.id) {
              rep.name = newData.name;
              rep.state = newData.state;
            }
          });
        }
      });
      return reducerReportCurrentSet(newState, contract.id);
    }
    case "REPORT-DELETE": {
      const delData = action.dataDelete[0];

      const contract = getContractById(curState.contracts, delData.contractId);
      const newState = {
        ...curState,
      };
      newState.contracts.forEach((contr) => {
        if (contr.id === contract.id) {
          contr.reports = [...contr.reports];
          contr.reports.forEach((rep, index) => {
            if (rep.id === delData.id) {
              contr.reports.splice(index, 1);
            }
          });
        }
      });
      return reducerReportCurrentSet(newState, contract.id);
    }
    case "REPORT-CURRENT-SET": {
      const newState = reducerReportCurrentSet(curState, action.contractId);

      if (newState.reports.length === 0)
        setTimeout(reportRefresh, 0, null, newState.contractId);

      return newState;
    }
    case "REPORT-CURRENT-DEL": {
      const newState = {
        ...curState,
        contractId: null,
        reports: null,
        reportId: null,
        files: null,
      };
      return newState;
    }
    case "FILE-CURRENT-SET": {
      const contract = getContractById(curState.contracts, action.contractId);
      const report = getReportById(contract.reports, action.reportId);
      const newState = {
        ...curState,
        contractId: action.contractId,
        reportId: action.reportId,
        reports: null,
        files: [...report.files],
      };

      if (newState.files.length === 0)
        setTimeout(getFiles, 0, contract.id, report.id);

      return newState;
    }
    case "FILE-ADD": {
      const newData = action.newData[0];

      const contract = getContractById(curState.contracts, action.contractId);
      const report = getReportById(contract.reports, newData.reportId);
      const newState = {
        ...curState,
      };
      newState.contracts.forEach((contr) => {
        if (contr.id === contract.id) {
          contr.reports.forEach((rep) => {
            if (rep.id === report.id) {
              rep.files = [...rep.files];
              rep.files.push(newData);
              newState.files = rep.files;
            }
          });
        }
      });

      return newState;
    }
    case "FILE-UPDATE": {
      const newData = action.newData[0];

      const contract = getContractById(curState.contracts, action.contractId);
      const report = getReportById(contract.reports, newData.reportId);
      const newState = {
        ...curState,
      };
      newState.contracts.forEach((contr) => {
        if (contr.id === contract.id) {
          contr.reports.forEach((rep) => {
            if (rep.id === report.id) {
              rep.files = [...rep.files];
              rep.files.forEach((file, i) => {
                if (file.id === newData.id) rep.files[i] = newData;
              });
              newState.files = rep.files;
            }
          });
        }
      });
      return newState;
    }
    case "FILE-DELETE": {
      const delData = action.dataDelete[0];

      const contract = getContractById(curState.contracts, action.contractId);
      const report = getReportById(contract.reports, delData.reportId);
      const newState = {
        ...curState,
      };
      newState.contracts.forEach((contr) => {
        if (contr.id === contract.id) {
          contr.reports.forEach((rep) => {
            if (rep.id === report.id) {
              rep.files = [...rep.files];
              rep.files.forEach((file, index) => {
                if (file.id === delData.id) {
                  rep.files.splice(index, 1);
                }
              });
              newState.files = rep.files;
            }
          });
        }
      });
      return newState;
    }
    case "UPDATE-CONTRACTS": {
      const newState = {
        ...curState,
        contracts: action.contracts,
      };

      return newState;
    }
    case "UPDATE-REPORTS": {
      const newState = {
        ...curState,
      };

      const contract = getContractById(newState.contracts, action.contractId);

      contract.reports = action.reports;
      newState.reports = action.reports;

      return newState;
    }
    case "UPDATE-FILES": {
      const contract = getContractById(curState.contracts, action.contractId);
      const report = getReportById(contract.reports, action.reportId);
      const newState = {
        ...curState,
      };
      newState.contracts.forEach((contr) => {
        if (contr.id === contract.id) {
          contr.reports.forEach((rep) => {
            if (rep.id === report.id) {
              rep.files = [...action.files];
              newState.files = rep.files;
            }
          });
        }
      });
      return newState;
    }
    default:
      return curState;
  }
};

function reducerReportCurrentSet(curState, contractId) {
  const contract = getContractById(curState.contracts, contractId);
  const newState = {
    ...curState,
    contractId: contract.id,
    reports: contract.reports,
  };

  return newState;
}

function getReportById(arr, id) {
  const report = arr.find((item, index, array) => {
    if (item.id === id) {
      return true;
    }
  });

  return report;
}

function getContractById(arr, id) {
  const contract = arr.find((item, index, array) => {
    if (item.id === id) {
      return true;
    }
  });

  return contract;
}

var store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

window.store = store;

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <App
        contracts={store.getState().contracts}
        reports={null}
        files={null}
        apikey={""}
      />
    </React.StrictMode>
  </Provider>,
  document.getElementById("root")
);
