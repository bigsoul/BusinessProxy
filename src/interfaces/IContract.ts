// interfaces
import IReport from "./IReport";

export type TContractFields = "name" | "state";

export default interface IContract {
  id: string;
  name: string;
  state: string;
  reports: IReport[];
}
