// react
import React, { Component } from "react";
// react-redux
import { connect } from "react-redux";
// interfaces
import IStore from "./interfaces/IStore";
import IFile from "./interfaces/IFile";
import IReport from "./interfaces/IReport";
import IContract from "./interfaces/IContract";
// components
import Files from "./components/Files/Files";
import Login from "./components/Login/Login";
import Header from "./components/Header/Header";
import Reports from "./components/Reports/Reports";
import Contracts from "./components/Contracts/Contracts";
import ReportAddSimply from "./components/Reports/ReportsAddSimply/ReportAddSimply";

import { Route, HashRouter, Switch, Redirect, Router, BrowserRouter, Link } from "react-router-dom";

interface IAppProps {
  apikey: string;
  name: string;
  loginState: { state: number };
  path: string;
  files: IFile[];
  reportId: string;
  reports: IReport[];
  contractId: string;
  contracts: IContract[];
}

class App extends Component<IAppProps> {
  render = () => {
    const { apikey, name, reports, loginState, contractId, files, reportId, contracts, path } = this.props;

    return (
      <>
        <Header apikey={apikey} name={name} />
        {apikey === "" ? (
          <Login loginState={loginState} />
        ) : path === "ReportAddSimply" ? (
          <ReportAddSimply contractId={contractId} />
        ) : contractId !== "" && reportId === "" ? (
          <Reports reports={reports} contractId={contractId} />
        ) : reportId !== "" ? (
          <Files files={files} contractId={contractId} reportId={reportId} />
        ) : (
          <Contracts contracts={contracts} />
        )}
      </>
    );
  };

  /*return (
      <>
        <Header apikey={apikey} name={name} />
        <Switch>
          <Route path="/" component={() => <Login loginState={loginState} />} />
          <Route path="/contracts/" component={() => <Contracts contracts={contracts} />} />
          <Route path="/reports/" component={() => <Reports reports={reports} contractId={contractId} />} />
          <Route path="/files/" component={() => <Files files={files} contractId={contractId} reportId={reportId} />} />
        </Switch>
      </>
    );*/
}

const mapStateToProps = (state: IStore, ownProps: IAppProps): IAppProps => {
  const { app } = state;
  return {
    apikey: app.apikey,
    name: app.name,
    loginState: app.loginState,
    path: app.path,
    files: app.files,
    reportId: app.reportId,
    reports: app.reports,
    contractId: app.contractId,
    contracts: app.contracts,
  };
};

export default connect(mapStateToProps)(App);
