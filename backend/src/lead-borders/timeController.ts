import TimeService from './timeService';
import { TypedRequestBody, ResponseType } from '../../index';
import { ITimes } from './borders';

class TimeController {
  async create(request: TypedRequestBody<ITimes>, response: ResponseType) {
    try {
      const userNameTime = await TimeService.create(request.body);
      return response.json(userNameTime);
    } catch (error) {
      response.status(500).json(error);
    }
  }

  async getAll(request: TypedRequestBody<ITimes>, response: ResponseType) {
    try {
      const times = await TimeService.getAll();
      return response.json(times);
    } catch (error) {
      response.status(500).json(error);
    }
  }

  async getOne(request: TypedRequestBody<ITimes>, response: ResponseType) {
    try {
      const time = await TimeService.getOne(request.params.id);
      return response.json(time);
    } catch (error) {
      response.status(500).json(error);
    }
  }

  async update(request: TypedRequestBody<ITimes>, response: ResponseType) {
    try {
      const updateTime = await TimeService.update(request.body);
      return response.json(updateTime);
    } catch (err) {
      response.status(500).json(err);
    }
  }

  async delete(request: TypedRequestBody<ITimes>, response: ResponseType) {
    try {
      const time = await TimeService.delete(request.params.id);
      return response.json(time);
    } catch (error) {
      response.status(500).json(error);
    }
  }
}

export default new TimeController();
