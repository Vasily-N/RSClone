/* eslint-disable no-underscore-dangle */
import UserService from './userService';
import { TypedRequestBody, ResponseType } from '../../index';
import User from './user';

export interface IUserBodyReq {
  name: string,
  password: string,
}

class UserController {
  async create(request: TypedRequestBody<IUserBodyReq>, response: ResponseType) {
    try {
      User.findOne({ name: request.body.name }, async (err: Error, example: any) => {
        if (err) console.log(err);
        if (example) {
          response.status(500).json({ result: 'this name is already taken' });
        } else {
          const userLoginPassword = await UserService.create(request.body);
          return response.json(userLoginPassword);
        }
      });
    } catch (error) {
      response.status(500).json(error);
    }
  }

  async getAll(request: TypedRequestBody<IUserBodyReq>, response: ResponseType) {
    try {
      const users = await UserService.getAll();
      return response.json(users);
    } catch (error) {
      response.status(500).json(error);
    }
  }

  async getOne(request: TypedRequestBody<IUserBodyReq>, response: ResponseType) {
    try {
      const user = await UserService.getOne(request.params.id);
      return response.json(user);
    } catch (error) {
      response.status(500).json(error);
    }
  }

  async update(request: TypedRequestBody<IUserBodyReq>, response: ResponseType) {
    try {
      // const updatedUser = await UserService.update(request.body);
      // return response.json(updatedUser);

      User.findOne({ name: request.body.name, password: request.body.password }, async (err: Error, example: any) => {
        if (err) {
          console.log('?????');
        }
        if (example) {
          // response.status(500).json({ result: 'this name is already taken' });
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
      const user = await UserService.delete(request.params.id);
      return response.json(user);
    } catch (error) {
      response.status(500).json(error);
    }
  }
}

export default new UserController();
