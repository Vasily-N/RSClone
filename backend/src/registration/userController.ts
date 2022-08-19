/* eslint-disable import/no-duplicates */
/* eslint-disable no-underscore-dangle */
import { IModelUser } from './user';
import UserService from './userService';
import { IUser } from './userService';

class UserController {
  async create(request: any, response: any) {
    try {
      const userLoginPassword = await UserService.create(request.body);
      return response.json(userLoginPassword); // response.json(userLoginPassword);
    } catch (error) {
      response.status(500).json(error);
    }
  }

  async getAll(request: any, response: any) {
    try {
      const users = await UserService.getAll();
      return response.json(users);
    } catch (error) {
      response.status(500).json(error);
    }
  }

  async getOne(request: any, response: any) {
    try {
      const user = await UserService.getOne(request.params.id);
      return response.json(user);
    } catch (error) {
      response.status(500).json(error);
    }
  }

  async update(request: any, response: any) {
    try {
      const updatedUser = await UserService.update(request.body);
      return response.json(updatedUser);
    } catch (error: any) {
      response.status(500).json(error.message);
    }
  }

  async delete(request: any, response: any) {
    try {
      const user = await UserService.delete(request.params.id);
      return response.json(user);
    } catch (error) {
      response.status(500).json(error);
    }
  }
}

export default new UserController();
