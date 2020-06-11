// interfaces
import IFile from "./IFile";

export default interface IReport {
  id: string;
  contractId: string;
  name: string;
  state: string;
  files: IFile[];
}
