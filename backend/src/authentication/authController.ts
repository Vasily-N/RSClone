/* eslint-disable no-underscore-dangle */
import AuthService from './authService';
import { TypedRequestBody, ResponseType } from '../../index';
import { IUserBodyReq } from '../registration/userController';

class AuthController {
  async create(request: TypedRequestBody<IUserBodyReq>, response: ResponseType) {
    try {
      const userLoginPassword = await AuthService.create(request.body);
      return response.json(userLoginPassword);
    } catch (error) {
      response.status(500).json(error);
    }
  }

  async getAll(request: TypedRequestBody<IUserBodyReq>, response: ResponseType) {
    try {
      const users = await AuthService.getAll();
      return response.json(users);
    } catch (error) {
      response.status(500).json(error);
    }
  }

  async getOne(request: TypedRequestBody<IUserBodyReq>, response: ResponseType) {
    try {
      const user = await AuthService.getOne(request.params.id);
      return response.json(user);
    } catch (error) {
      response.status(500).json(error);
    }
  }

  async update(request: TypedRequestBody<IUserBodyReq>, response: ResponseType) {
    try {
      const updatedUser = await AuthService.update(request.body);
      return response.json(updatedUser);
    } catch (err) {
      response.status(500).json(err);
    }
  }

  async delete(request: TypedRequestBody<IUserBodyReq>, response: ResponseType) {
    try {
      const user = await AuthService.delete(request.params.id);
      return response.json(user);
    } catch (error) {
      response.status(500).json(error);
    }
  }
}

export default new AuthController();
