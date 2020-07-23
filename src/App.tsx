// react
import React, { Component } from "react";
// react-redux
import { connect } from "react-redux";
// interfaces
import IStore from "./interfaces/IStore";
import IUser from "./interfaces/IUser";
// components
import Files from "./components/Files/Files";
import Login from "./components/Login/Login";
import Header from "./components/Header/Header";
import Reports from "./components/Reports/Reports";
import Contracts from "./components/Contracts/Contracts";
import ReportAddSimply from "./components/Reports/ReportsAddSimply/ReportAddSimply";

import { Route, HashRouter, Switch, Redirect, Router, BrowserRouter, Link } from "react-router-dom";
import IContract from "./interfaces/IContract";
import reportsReducer from "./classes/reducers/reports";
import IReport from "./interfaces/IReport";
import { RouterState } from "connected-react-router";
import { LocationState } from "history";

interface IAppProps {
  user: IUser;
  contracts: IContract[];
  reports: IReport[];
  router: RouterState<LocationState>;
}

class App extends Component<IAppProps> {
  render = () => {
    const { user, contracts, reports, router } = this.props;

    return (
      <>
        <Header user={user} />
        <Switch>
          <Route exec path="/contracts" component={() => <Contracts user={user} contracts={contracts} />} />
          <Route exec path="/reports" component={() => <Reports user={user} reports={reports} router={router} />} />
          {/*<Route exec path="/reports/wizard/:contractId" component={() => <ReportAddSimply user={user} />} />          
          <Route exec path="/files/:reportId" component={() => <Files user={user} />} />
          <Route exec path="/login" component={() => <Login user={user} />} />*/}
          <Route exec path="/login" component={() => <Login />} />
        </Switch>
      </>
    );
  };
}

const mapStateToProps = (state: IStore, ownProps: IAppProps): IAppProps => {
  const { user, contracts, reports, router } = state;
  return {
    user: user,
    contracts: contracts.list,
    reports: reports.list,
    router: router,
  };
};

export default connect(mapStateToProps)(App);
