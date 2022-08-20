/* eslint-disable no-underscore-dangle */
import BorderService from './borderService';
import { TypedRequestBody, ResponseType } from '../../index';
import { ITimes } from './borders';

class BorderController {
  async create(request: TypedRequestBody<ITimes>, response: ResponseType) {
    try {
      const userNameTime = await BorderService.create(request.body);
      return response.json(userNameTime);
    } catch (error) {
      response.status(500).json(error);
    }
  }

  async getAll(request: TypedRequestBody<ITimes>, response: ResponseType) {
    try {
      const times = await BorderService.getAll();
      return response.json(times);
    } catch (error) {
      response.status(500).json(error);
    }
  }

  async getOne(request: TypedRequestBody<ITimes>, response: ResponseType) {
    try {
      const time = await BorderService.getOne(request.params.id);
      return response.json(time);
    } catch (error) {
      response.status(500).json(error);
    }
  }

  async update(request: TypedRequestBody<ITimes>, response: ResponseType) {
    try {
      const updateTime = await BorderService.update(request.body);
      return response.json(updateTime);
    } catch (err) {
      response.status(500).json(err);
    }
  }

  async delete(request: TypedRequestBody<ITimes>, response: ResponseType) {
    try {
      const time = await BorderService.delete(request.params.id);
      return response.json(time);
    } catch (error) {
      response.status(500).json(error);
    }
  }
}

export default new BorderController();
