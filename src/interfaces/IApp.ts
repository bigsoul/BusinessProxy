// interfaces
import IUser from "./IUser";
import IFile from "./IFile";
import IReport from "./IReport";
import IContract from "./IContract";

export default interface IApp {
  user: IUser;
  files: IFile[];
  reports: IReport[];
  contracts: IContract[];
}
