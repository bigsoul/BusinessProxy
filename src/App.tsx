// react
import React, { Component } from "react";
// react-redux
import { connect } from "react-redux";
// components
import Files from "./components/Files/Files";
import Login from "./components/Login/Login";
import Header from "./components/Header/Header";
import Reports from "./components/Reports/Reports";
import Contracts from "./components/Contracts/Contracts";

interface IAppProps {
  apikey: string;
  name: string;
  loginState: { state: any };
  files: any;
  reportId: any;
  reports: any;
  contractId: any;
  contracts: any;
}

class App extends Component<IAppProps> {
  render = () => {
    return (
      <>
        <Header />
        {this.props.apikey === "" ? (
          <Login />
        ) : this.props.reports !== null ? (
          <Reports
            reports={this.props.reports}
            contractId={this.props.contractId}
          />
        ) : this.props.files !== null ? (
          <Files
            files={this.props.files}
            contractId={this.props.contractId}
            reportId={this.props.reportId}
          />
        ) : (
          <Contracts contracts={this.props.contracts} />
        )}
      </>
    );
  };
}

const mapStateToProps = (state: IAppProps, ownProps: IAppProps) => {
  return {
    apikey: state.apikey,
    name: state.name,
    loginState: state.loginState,
    files: state.files,
    reportId: state.reportId,
    reports: state.reports,
    contractId: state.contractId,
    contracts: state.contracts,
  };
};

export default connect(mapStateToProps)(App);
