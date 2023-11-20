import { IUserInfo, IUserInfoUpdate } from '../interfaces';

export class UserInfoEntity implements IUserInfo {
  id?: string;
  userId?: string;

  name?: string | null;
  phone?: string | null;
  address?: string | null;
  about?: string | null;

  public static get Empty(): UserInfoEntity {
    return new UserInfoEntity({});
  }

  constructor(userInfo: IUserInfo) {
    this.id = userInfo.id;
    this.userId = userInfo.userId;
    this.name = userInfo.name;
    this.phone = userInfo.phone;
    this.address = userInfo.address;
    this.about = userInfo.about;
  }

  getUpdate(): IUserInfoUpdate {
    return {
      name: this.name,
      phone: this.phone,
      address: this.address,
      about: this.about,
    };
  }
}
