import WinService from './winService';
import { TypedRequestBody, ResponseType } from '../../index';
import { IWins } from './borders';

class WinController {
  async create(request: TypedRequestBody<IWins>, response: ResponseType) {
    try {
      const userNameWin = await WinService.create(request.body);
      return response.json(userNameWin);
    } catch (error) {
      response.status(500).json(error);
    }
  }

  async getAll(request: TypedRequestBody<IWins>, response: ResponseType) {
    try {
      const wins = await WinService.getAll();
      return response.json(wins);
    } catch (error) {
      response.status(500).json(error);
    }
  }

  async getOne(request: TypedRequestBody<IWins>, response: ResponseType) {
    try {
      const win = await WinService.getOne(request.params.id);
      return response.json(win);
    } catch (error) {
      response.status(500).json(error);
    }
  }

  async update(request: TypedRequestBody<IWins>, response: ResponseType) {
    try {
      const updateTime = await WinService.update(request.body);
      return response.json(updateTime);
    } catch (err) {
      response.status(500).json(err);
    }
  }

  async delete(request: TypedRequestBody<IWins>, response: ResponseType) {
    try {
      const win = await WinService.delete(request.params.id);
      return response.json(win);
    } catch (error) {
      response.status(500).json(error);
    }
  }
}

export default new WinController();
