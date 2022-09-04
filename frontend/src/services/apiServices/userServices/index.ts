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

interface IUserService {
  createUser:(data: UserData) => Promise<UserData>;
  getUsers:() => Promise<ListResponse<User>>;
  getUser:(id: string) => Promise<User | undefined>;
  deleteUser:(id: string) => Promise<boolean | Response>;
  updateUser:(data: UserData) => Promise<User | undefined>;
}

class UserServices extends ApiService implements IUserService {
  public async createUser(data: UserData):Promise<UserData> {
    const user = await super.create<UserData>(data);
    if (!user) {
      throw new Error('this name is already taken');
    }
    return user as UserData;
  }

  public async getUsers():Promise<ListResponse<User>> {
    const query: Data = {};
    return super.getAll<User>(query);
  }

  public async getUser(id: string):Promise<User | undefined> {
    return super.getId<User>(id);
  }

  public async deleteUser(id: string):Promise<boolean | Response> {
    return super.delete(id);
  }

  public async updateUser(data: UserData):Promise<User | undefined> {
    const updated = await super.update<User>(data);
    if (!updated) {
      throw new Error('that user not found');
    }
    return updated;
  }
}

export { IUserService, UserServices };
