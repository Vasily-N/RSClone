/* eslint-disable no-underscore-dangle */
import { Types } from 'mongoose';
import { ITimesId, TimesScheme } from './borders';

class TimeService {
  async create(time: ITimesId) {
    const createTime = await TimesScheme.create(time);
    return createTime;
  }

  async getAll() {
    const times = await TimesScheme.find().sort({ time: 1 });
    return times;
  }

  async getOne(id: string) {
    if (!id) {
      throw new Error('no ID');
    }
    const time = await TimesScheme.findById(id);
    return time;
  }

  async update(time: ITimesId) {
    if (!time._id) {
      throw new Error('no ID');
    }
    const updatedData = await TimesScheme.findByIdAndUpdate(time._id, time, { new: true });
    return updatedData;
  }

  async delete(id: string) {
    if (!id) {
      throw new Error('no ID');
    }
    const time = await TimesScheme.findByIdAndDelete(id);
    return time;
  }

  startUserGame(id: Types.ObjectId) {
    const userID = (id.toString().match(/[0-9a-z]/g) as string[]).join('');
    console.log(userID, 'login');
    return userID;
  }
}

export default new TimeService();
