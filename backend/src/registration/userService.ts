/* eslint-disable no-underscore-dangle */
import User from './user';

export interface IUser {
  _id?: string;
  name: string,
  password: string,
}

class UserService {
  async create(user: IUser) {
    const userNameAndPass = await User.find({ name: user.name, password: user.password });
    const userName = await User.find({ name: user.name });

    if (userNameAndPass.length !== 0) {
      console.log(userNameAndPass, 'you are entry');
    } else if (userName.length !== 0) {
      console.log(userName, 'name already exist');
    } else {
      const userLoginPassword = await User.create(user);
      console.log(userLoginPassword, 'created');
      return userLoginPassword;
    }
  }

  async getAll() {
    const users = await User.find();
    return users;
  }

  async getOne(id: string) {
    if (!id) {
      throw new Error('no ID');
    }
    const user = await User.findById(id);
    return user;
  }

  async update(user: IUser) {
    if (!user._id) {
      throw new Error('no ID');
    }
    const updatedData = await User.findByIdAndUpdate(user._id, user, { new: true });
    return updatedData;
  }

  async delete(id: string) {
    if (!id) {
      throw new Error('no ID');
    }
    const user = await User.findByIdAndDelete(id);
    return user;
  }
}

export default new UserService();
