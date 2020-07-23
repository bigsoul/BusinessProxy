export interface ILoginRequest {
  login: string;
  password: string;
}

export interface ILogoutRequest {
  apikey: string;
}

export interface IGetContractsRequest {
  apikey: string;
}

export type TRequest = ILoginRequest | IGetContractsRequest | ILogoutRequest;
