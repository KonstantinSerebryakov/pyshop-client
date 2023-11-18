import { IUser } from '../accounts/user.interface';

export interface IToken {
  token: string;
  exp: number;
  iat: number;
}

export interface ILoginResponsePayload {
  user: IUser;
  access_token: Omit<IToken, 'iat'>;
  refresh_token: Omit<IToken, 'iat'>;
}

export interface IRefreshTokensResponsePayload {
  access_token: IToken;
  refresh_token: IToken;
}

export interface IRegisterResponsePayload {
  user: IUser;
}

export interface ILoginQueryPayload {
  email: string;
  password: string;
}

export interface IRegisterQueryPayload {
  email: string;
  password: string;
}
