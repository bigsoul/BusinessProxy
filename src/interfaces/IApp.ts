// interfaces
import ILoginState from "./ILoginState";
import IFile from "./IFile";
import IReport from "./IReport";
import IContract from "./IContract";

export default interface IApp {
  apikey: string;
  name: string;
  path: string;
  loginState: ILoginState;
  files: IFile[];
  reportId: string;
  reports: IReport[];
  contractId: string;
  contracts: IContract[];
}
