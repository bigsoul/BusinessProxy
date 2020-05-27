import "typeface-roboto";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { v4 as uuidv4 } from "uuid";

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
      {
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
                name: "Файл 1",
              },
              {
                id: "3f4e1283-c86f-47b8-bde5-b998eabdbcba",
                raportId: "73025e53-f30d-47cc-b6b2-d09591243e0c",
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
                name: "Файл 1",
              },
              {
                id: "456df632-b22e-4f5c-837e-af7d93e04b80",
                raportId: "a4dafb57-c788-426e-bcd7-266467f3d4b4",
                name: "Файл 2",
              },
            ],
          },
        ],
      },
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
      const contract = getContractById(curState.contracts, action.contractId);
      const newState = {
        ...curState,
      };
      newState.contracts.forEach((element) => {
        if (element.id === contract.id) {
          element.reports = [...element.reports];
          element.reports.push(
            addReport(action.newData.contractId, action.newData.name)
          );
        }
      });
      return reducerReportCurrentSet(newState, contract.id);
    }
    case "REPORT-UPDATE": {
      const contract = getContractById(curState.contracts, action.contractId);
      const newState = {
        ...curState,
      };
      newState.contracts.forEach((element) => {
        if (element.id === contract.id) {
          element.reports = [...action.dataUpdate];
        }
      });
      return reducerReportCurrentSet(newState, contract.id);
    }
    case "REPORT-DELETE": {
      const contract = getContractById(curState.contracts, action.contractId);
      const newState = {
        ...curState,
      };
      newState.contracts.forEach((element) => {
        if (element.id === contract.id) {
          element.reports = [...action.dataDelete];
        }
      });
      return reducerReportCurrentSet(newState, contract.id);
    }
    case "REPORT-CURRENT-SET": {
      return reducerReportCurrentSet(curState, action.contractId);
    }
    case "REPORT-CURRENT-DEL": {
      const newState = {
        ...curState,
        contractId: null,
        reports: null,
      };
      return newState;
    }
    default:
      return curState;
  }
};

function addReport(contractId, name) {
  const id = uuidv4();
  const report = {
    id: id,
    contractId: contractId,
    name: name,
    state: "Новый",
    files: [
      { id: uuidv4(), raportId: id, name: "Файл 1" },
      { id: uuidv4(), raportId: id, name: "Файл 2" },
    ],
  };

  return report;
}

function reducerReportCurrentSet(curState, contractId) {
  const contract = getContractById(curState.contracts, contractId);
  const newState = {
    ...curState,
    contractId: contract.id,
    reports: contract.reports,
  };

  return newState;
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

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

var dateFormat = (function () {
  var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
    timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
    timezoneClip = /[^-+\dA-Z]/g,
    pad = function (val, len) {
      val = String(val);
      len = len || 2;
      while (val.length < len) val = "0" + val;
      return val;
    };

  // Regexes and supporting functions are cached through closure
  return function (date, mask, utc) {
    var dF = dateFormat;

    // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
    if (
      arguments.length === 1 &&
      Object.prototype.toString.call(date) === "[object String]" &&
      !/\d/.test(date)
    ) {
      mask = date;
      date = undefined;
    }

    // Passing date through Date applies Date.parse, if necessary
    date = date ? new Date(date) : new Date();
    if (isNaN(date)) throw SyntaxError("invalid date");

    mask = String(dF.masks[mask] || mask || dF.masks["default"]);

    // Allow setting the utc argument via the mask
    if (mask.slice(0, 4) === "UTC:") {
      mask = mask.slice(4);
      utc = true;
    }

    var _ = utc ? "getUTC" : "get",
      d = date[_ + "Date"](),
      D = date[_ + "Day"](),
      m = date[_ + "Month"](),
      y = date[_ + "FullYear"](),
      H = date[_ + "Hours"](),
      M = date[_ + "Minutes"](),
      s = date[_ + "Seconds"](),
      L = date[_ + "Milliseconds"](),
      o = utc ? 0 : date.getTimezoneOffset(),
      flags = {
        d: d,
        dd: pad(d),
        ddd: dF.i18n.dayNames[D],
        dddd: dF.i18n.dayNames[D + 7],
        m: m + 1,
        mm: pad(m + 1),
        mmm: dF.i18n.monthNames[m],
        mmmm: dF.i18n.monthNames[m + 12],
        yy: String(y).slice(2),
        yyyy: y,
        h: H % 12 || 12,
        hh: pad(H % 12 || 12),
        H: H,
        HH: pad(H),
        M: M,
        MM: pad(M),
        s: s,
        ss: pad(s),
        l: pad(L, 3),
        L: pad(L > 99 ? Math.round(L / 10) : L),
        t: H < 12 ? "a" : "p",
        tt: H < 12 ? "am" : "pm",
        T: H < 12 ? "A" : "P",
        TT: H < 12 ? "AM" : "PM",
        Z: utc
          ? "UTC"
          : (String(date).match(timezone) || [""])
              .pop()
              .replace(timezoneClip, ""),
        o:
          (o > 0 ? "-" : "+") +
          pad(Math.floor(Math.abs(o) / 60) * 100 + (Math.abs(o) % 60), 4),
        S: ["th", "st", "nd", "rd"][
          d % 10 > 3 ? 0 : (((d % 100) - (d % 10) !== 10) * d) % 10
        ],
      };

    return mask.replace(token, function ($0) {
      return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
    });
  };
})();

// Some common format strings
dateFormat.masks = {
  default: "ddd mmm dd yyyy HH:MM:ss",
  shortDate: "m/d/yy",
  mediumDate: "mmm d, yyyy",
  longDate: "mmmm d, yyyy",
  fullDate: "dddd, mmmm d, yyyy",
  shortTime: "h:MM TT",
  mediumTime: "h:MM:ss TT",
  longTime: "h:MM:ss TT Z",
  isoDate: "yyyy-mm-dd",
  isoTime: "HH:MM:ss",
  isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
  isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'",
};

// Internationalization strings
dateFormat.i18n = {
  dayNames: [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],
  monthNames: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
};

// For convenience...
Date.prototype.format = function (mask, utc) {
  return dateFormat(this, mask, utc);
};
