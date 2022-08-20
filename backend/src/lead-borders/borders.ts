import mongoose from 'mongoose';

export interface ITimes{
  name: string,
  time: string,
}

export interface ITimesId {
  _id?: string;
  name: string,
  time: string,
}

const Times = new mongoose.Schema(
  {
    name: { type: String, required: true },
    time: { type: String, required: true },
  },
);

export default mongoose.model('Times', Times);
