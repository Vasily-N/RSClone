/* eslint-disable no-underscore-dangle */
import AuthService from './authService';
import { TypedRequestBody, ResponseType } from '../../index';
import { IUserBodyReq } from '../registration/userController';
import User from '../registration/user';

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
      User.findOne({ name: request.body.name, password: request.body.password }, async (err: Error, example: any) => {
        if (err) {
          return response.status(500).json({ result: 'user not found' });
        }
        if (example) {
          return response.status(202).json({ result: 'you are logged' });
        }
        return response.status(500).json({ result: 'user not found' });
      });
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
