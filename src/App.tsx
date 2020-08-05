// react
import React, { Component } from "react";
// react-redux
import { connect } from "react-redux";
// interfaces
import IStore from "./interfaces/IStore";
import IUser from "./interfaces/IUser";
// components
import Login from "./components/Login/Login";
import Header from "./components/Header/Header";
import Reports from "./components/Reports/Reports";
import Contracts from "./components/Contracts/Contracts";

import { Route, Switch } from "react-router-dom";
import IContract from "./interfaces/IContract";
import IReport from "./interfaces/IReport";
import { RouterState } from "connected-react-router";
import { LocationState } from "history";
import Files from "./components/Files/Files";
import IFile from "./interfaces/IFile";
import WizardReports from "./components/Reports/WizardReports/WizardReports";

interface IAppProps {
  user: IUser;
  contracts: IContract[];
  reports: IReport[];
  files: IFile[];
  router: RouterState<LocationState>;
}

class App extends Component<IAppProps> {
  render = () => {
    const { user, contracts, reports, files, router } = this.props;

    return (
      <>
        <Header user={user} />
        <Switch>
          <Route exec path="/contracts">
            <Contracts user={user} contracts={contracts} />
          </Route>
          <Route exec path="/reports/wizard">
            <WizardReports user={user} router={router} />
          </Route>
          <Route exec path="/reports">
            <Reports user={user} reports={reports} router={router} />
          </Route>
          <Route exec path="/files">
            <Files user={user} files={files} router={router} />
          </Route>
          <Route exec path="/login">
            <Login />
          </Route>
        </Switch>
      </>
    );
  };
}

const mapStateToProps = (state: IStore, ownProps: IAppProps): IAppProps => {
  const { user, contracts, reports, files, router } = state;
  return {
    user: user,
    contracts: contracts.list,
    reports: reports.table.list,
    files: files.list,
    router: router,
  };
};

export default connect(mapStateToProps)(App);
