// interfaces
import IFile from "./IFile";

export default interface IReport {
  id: string;
  name: string;
  state: string;
  files: IFile[];
  contractId: string;
}
