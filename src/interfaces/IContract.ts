// interfaces
import IReport from "./IReport";
export default interface IContract {
  id: string;
  name: string;
  state: string;
  reports: IReport[];
}
