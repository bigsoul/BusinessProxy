import React from "react";
import Header from "./components/Header/Header";
import Contracts from "./components/Contracts/Contracts";
import Login from "./components/Login/Login";
import Reports from "./components/Reports/Reports";
import Files from "./components/Files/Files";
import { connect } from "react-redux";

function App(props) {
  return (
    <>
      <Header />
      {props.apikey === "" ? (
        <Login />
      ) : props.reports !== null ? (
        <Reports reports={props.reports} contractId={props.contractId} />
      ) : props.files !== null ? (
        <Files files={props.files} />
      ) : (
        <Contracts contracts={props.contracts} />
      )}
    </>
  );
}

const mapStateToProps = (state, ownProps) => {
  return {
    apikey: state.apikey,
    files: state.files,
    reports: state.reports,
    contractId: state.contractId,
    contracts: state.contracts,
  };
};

export default connect(mapStateToProps)(App);
