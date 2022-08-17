/* eslint-disable no-underscore-dangle */
import UserService from './userService.js';

class UserController {
  async create(request, response) {
    try {
      const userLoginPassword = await UserService.create(request.body);
      response.json(userLoginPassword);
    } catch (error) {
      response.status(500).json(error);
    }
  }

  async getAll(request, response) {
    try {
      const users = await UserService.getAll();
      return response.json(users);
    } catch (error) {
      response.status(500).json(error);
    }
  }

  async getOne(request, response) {
    try {
      const user = await UserService.getOne(request.params.id);
      return response.json(user);
    } catch (error) {
      response.status(500).json(error);
    }
  }

  async update(request, response) {
    try {
      const updatedUser = await UserService.update(request.body);
      return response.json(updatedUser);
    } catch (error) {
      response.status(500).json(error.message);
    }
  }

  async delete(request, response) {
    try {
      const user = await UserService.delete(request.params.id);
      return response.json(user);
    } catch (error) {
      response.status(500).json(error);
    }
  }
}

export default new UserController();
