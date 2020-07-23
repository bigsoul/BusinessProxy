import IContract from "./IContract";

export interface ILoginResponse {
  apikey: string;
  name: string;
}

export interface ILogoutResponse {
  apikey: string;
  name: string;
}

export interface IGetContractsResponse extends Array<IContract> {}

export type TResponse = ILoginResponse | IGetContractsResponse | ILogoutResponse;
