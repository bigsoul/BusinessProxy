import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

import React from "react";
import "./App.css";
import Button from "@material-ui/core/Button";

function App() {
  return (
    <div className="App">
      <nav className="navbar navbar-expand-lg navbar-light bg-dark">
        <a className="navbar-brand text-info" href=".\">
          НЕОМЕТРИЯ
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <a className="nav-link text-light" href=".\">
                Мои договоры <span className="sr-only">(current)</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-light" href=".\">
                Мои отчеты
              </a>
            </li>
          </ul>
          <form className="form-inline my-2 my-lg-0">
            <input
              className="form-control mr-sm-2"
              type="search"
              placeholder="Поиск договора"
              aria-label="Search"
            ></input>

            <button
              className="btn btn-outline-success my-2 my-sm-0"
              type="submit"
            >
              Найти
            </button>

            <button type="button" className="btn btn-info" onClick={login}>
              Войти
            </button>
          </form>
        </div>
      </nav>
      <Button variant="contained" color="primary">
        Hello World
      </Button>
    </div>
  );
}

function login(): void {
  var xhr = new XMLHttpRequest();

  var body =
    "name=" +
    encodeURIComponent("exchange") +
    "&surname=" +
    encodeURIComponent("exchange2016");

  xhr.open(
    "POST",
    "http://185.26.205.42:8086/do_demo/hs/BusinessProxy/LoginIn",
    true,
    "exchange",
    "exchange2016"
  );
  /*xhr.setRequestHeader(
    "Authorization",
    "Basic " + btoa("exchange:exchange2016")
  );*/
  xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
  xhr.setRequestHeader("Access-Control-Allow-Headers", "*");
  xhr.setRequestHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  //xhr.setRequestHeader("Authorization", "");
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  //xhr.withCredentials = true;
  xhr.onreadystatechange = function () {
    console.log("onreadystatechange");
  };

  xhr.send(body);
}

export default App;
