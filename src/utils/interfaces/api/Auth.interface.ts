import { IUser } from '../accounts/user.interface';

export interface ILoginResponsePayload {
  user: IUser;
  token: string;
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
