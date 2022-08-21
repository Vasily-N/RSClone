/* eslint-disable no-underscore-dangle */
import { Types } from 'mongoose';
import { WinsScheme, IWinsId } from './borders';

class WinService {
  async create(win: IWinsId) {
    const createWin = await WinsScheme.create(win);
    return createWin;
  }

  async getAll() {
    const wins = await WinsScheme.find();
    return wins;
  }

  async getOne(id: string) {
    if (!id) {
      throw new Error('no ID');
    }
    const win = await WinsScheme.findById(id);
    return win;
  }

  async update(win: IWinsId) {
    if (!win._id) {
      throw new Error('no ID');
    }
    const updatedData = await WinsScheme.findByIdAndUpdate(win._id, win, { new: true });
    return updatedData;
  }

  async delete(id: string) {
    if (!id) {
      throw new Error('no ID');
    }
    const win = await WinsScheme.findByIdAndDelete(id);
    return win;
  }

  startUserGame(id: Types.ObjectId) {
    const userID = (id.toString().match(/[0-9a-z]/g) as string[]).join('');
    console.log(userID, 'login');
    return userID;
  }
}

export default new WinService();
