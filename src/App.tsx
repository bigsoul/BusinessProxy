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
import { Route, HashRouter, Switch, Redirect, Router, BrowserRouter } from "react-router-dom";

interface IAppProps {
  apikey: string;
  name: string;
  loginState: { state: number };
  files: IFile[];
  reportId: string;
  reports: IReport[];
  contractId: string;
  contracts: IContract[];
}

class App extends Component<IAppProps> {
  render = () => {
    const { apikey, name, reports, loginState, contractId, files, reportId, contracts } = this.props;
    return (
      <>
        <Header apikey={apikey} name={name} />

        <Switch>
          <Route exact path="/" component={() => <Login loginState={loginState} />} />
          <Route exact path="/contracts" component={() => <Contracts contracts={contracts} />} />
          <Route exact path="/reports" component={() => <Reports reports={reports} contractId={contractId} />} />
          <Route exact path="/files" component={() => <Files files={files} contractId={contractId} reportId={reportId} />} />
        </Switch>
      </>
    );

    /*return (
      <>
        <Header apikey={apikey} name={name} />
        {apikey === "" ? (
          <Login loginState={loginState} />
        ) : reports.length > 0 ? (
          <Reports reports={reports} contractId={contractId} />
        ) : files.length > 0 ? (
          <Files files={files} contractId={contractId} reportId={reportId} />
        ) : (
          <Contracts contracts={contracts} />
        )}
      </><Redirect exact path="/" to={apikey === "" ? "login" : "contracts"} />
    );*/
  };
}

const mapStateToProps = (state: IStore, ownProps: IAppProps): IAppProps => {
  const { app } = state;
  return {
    apikey: app.apikey,
    name: app.name,
    loginState: app.loginState,
    files: app.files,
    reportId: app.reportId,
    reports: app.reports,
    contractId: app.contractId,
    contracts: app.contracts,
  };
};

export default connect(mapStateToProps)(App);
