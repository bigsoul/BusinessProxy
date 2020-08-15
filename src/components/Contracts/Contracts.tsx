// react
import React, { Component, forwardRef } from "react";
// react-redux
import { connect } from "react-redux";
// constants
import { TAction, IGetContractsAction, GET_CONTRACTS, IContractsClearErrorAction, CONTRACTS_CLEAR_ERROR } from "../../types/TAction";
// interfaces
import IStore from "../../interfaces/IStore";
import IContract from "../../interfaces/IContract";
// components-material-ui
import Button from "@material-ui/core/Button";
// classes-material-ui
import { createStyles, withStyles, WithStyles, Theme } from "@material-ui/core/styles";
import IUser from "../../interfaces/IUser";
import { Dispatch } from "redux";
import { Snackbar } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import AddBox from "@material-ui/icons/AddBox";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";
import MaterialTable, { Column } from "material-table";
import ContractsRowControlButton from "./ContractsRowControlButton/ContractsRowControlButton";

// difination styling plan

type TStyleClasses = "refreshContracts";

const sourceStyles: Record<TStyleClasses, {}> = {
  refreshContracts: { float: "right" },
};

let styles = (theme: Theme) => createStyles<TStyleClasses, {}>(sourceStyles);

// own interfaces

interface IContractsProps extends WithStyles<typeof styles> {
  user: IUser;
  contracts: IContract[];
  errorText?: string;
  getContractsAction?: (apikey: string) => void;
  contractsClearErrorAction?: () => void;
}

interface IContractsState {
  columns: Column<IContract>[];
}

class Contracts extends Component<IContractsProps, IContractsState> {
  componentDidMount = (): void => {
    this.hendleGetContractsAction();
  };

  hendleGetContractsAction = (): void => {
    const { getContractsAction, user } = this.props;
    getContractsAction && getContractsAction(user.apikey);
  };

  hendleContractsClearErrorAction = (): void => {
    const { contractsClearErrorAction } = this.props;
    contractsClearErrorAction && contractsClearErrorAction();
  };

  tableIcons = {
    Add: forwardRef<SVGSVGElement, {}>((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef<SVGSVGElement, {}>((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef<SVGSVGElement, {}>((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef<SVGSVGElement, {}>((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef<SVGSVGElement, {}>((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef<SVGSVGElement, {}>((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef<SVGSVGElement, {}>((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef<SVGSVGElement, {}>((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef<SVGSVGElement, {}>((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef<SVGSVGElement, {}>((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef<SVGSVGElement, {}>((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef<SVGSVGElement, {}>((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef<SVGSVGElement, {}>((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef<SVGSVGElement, {}>((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef<SVGSVGElement, {}>((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef<SVGSVGElement, {}>((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef<SVGSVGElement, {}>((props, ref) => <ViewColumn {...props} ref={ref} />),
  };

  state: IContractsState = {
    columns: [
      {
        title: "Наименование",
        field: "name",
        initialEditValue: "",
      },
      {
        title: "Состояние",
        field: "state",
        initialEditValue: "",
        editable: "never",
      },
      {
        title: (
          <Button
            className={this.props.classes["refreshContracts"]}
            variant="outlined"
            size="small"
            color="primary"
            onClick={this.hendleGetContractsAction}
          >
            {"Обновить"}
          </Button>
        ),
        field: "buttom",
        initialEditValue: "",
        sorting: false,
        render: (rowData: IContract) => {
          const { user } = this.props;
          return <ContractsRowControlButton apikey={user.apikey} contractId={rowData.id} />;
        },
      },
    ],
  };

  render = (): JSX.Element => {
    const { contracts, errorText } = this.props;
    const { columns } = this.state;
    const { tableIcons } = this;

    return (
      <>
        <MaterialTable
          icons={tableIcons}
          title="Список договоров: "
          columns={columns}
          data={contracts}
          localization={{
            header: { actions: "" },
            toolbar: {
              searchTooltip: "Найти договор ...",
              searchPlaceholder: "Найти договор ...",
            },
            pagination: { labelRowsSelect: "строк" },
            body: { editRow: { deleteText: "Вы уверены ?" } },
          }}
          onRowClick={() => {}}
          editable={{}}
        />
        {/** Обратная связь + */}
        <Snackbar open={!!errorText} autoHideDuration={3000} onClose={this.hendleContractsClearErrorAction}>
          <MuiAlert elevation={6} variant="filled" severity="error" onClose={this.hendleContractsClearErrorAction}>
            {errorText}
          </MuiAlert>
        </Snackbar>
        {/** Обратная связь - */}
      </>
    );
  };
}

const mapStateToProps = (state: IStore, ownProps: IContractsProps): IContractsProps => {
  const { user, contracts } = state;
  return {
    user: user,
    contracts: contracts.list,
    errorText: contracts.errorText,
    classes: ownProps.classes,
    getContractsAction: ownProps.getContractsAction,
    contractsClearErrorAction: ownProps.contractsClearErrorAction,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<TAction>) => {
  return {
    getContractsAction: (apikey: string): void => {
      dispatch<IGetContractsAction>({
        type: GET_CONTRACTS,
        apikey: apikey,
      });
    },
    contractsClearErrorAction: (): void => {
      dispatch<IContractsClearErrorAction>({
        type: CONTRACTS_CLEAR_ERROR,
      });
    },
  };
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Contracts));
