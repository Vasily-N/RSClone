import { ApiService, ListResponse } from '..';
import { Data } from '../api';

export type User = {
  name: string,
  password: string,
  _id: string,
  __v: string,
};

export type UserData = {
  name: string,
  password: string,
};

interface IUserSrvice {
  createUser:(data: UserData) => Promise<UserData>;
  getUsers:() => Promise<ListResponse<User>>;
  getUser:(id: number) => Promise<User | undefined>;
  deleteUser:(id: number) => Promise<boolean | Response>;
  updateUser:(id: number, data: UserData) => Promise<User | undefined>;
}

class UserServices extends ApiService implements IUserSrvice {
  public async createUser(data: UserData):Promise<UserData> {
    return (await super.create<UserData>(data)) as UserData;
  }

  public async getUsers():Promise<ListResponse<User>> {
    const query: Data = {};
    return super.getAll<User>(query);
  }

  public async getUser(id: number):Promise<User | undefined> {
    return super.getId<User>(id);
  }

  public async deleteUser(id: number):Promise<boolean | Response> {
    return super.delete(id);
  }

  public async updateUser(id: number, data: UserData):Promise<User | undefined> {
    return super.update<User>(id, data);
  }
}

export { IUserSrvice, UserServices };
