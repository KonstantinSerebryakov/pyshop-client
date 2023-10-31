import { IUser } from '../interfaces';

export class UserEntity implements IUser {
  id?: string;
  email: string;

  constructor(user: IUser) {
    this.id = user.id;
    this.email = user.email;
  }
}
