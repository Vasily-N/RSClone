import mongoose from 'mongoose';

export interface ITimes{
  name: string,
  time: number,
  date: string,
}

export interface ITimesId {
  _id?: string;
  name: string,
  time: number,
  date: string,
}

export interface IWins{
  name: string,
  win: string,
  date: string,
}

export interface IWinsId {
  _id?: string;
  name: string,
  win: string,
  date: string,
}

const Times = new mongoose.Schema(
  {
    name: { type: String, required: true },
    time: { type: Number, required: true },
    date: { type: String, required: true },
  },
);

const Wins = new mongoose.Schema(
  {
    name: { type: String, required: true },
    win: { type: String, required: true },
    date: { type: String, required: true },
  },
);

export const TimesScheme = mongoose.model('Times', Times);
export const WinsScheme = mongoose.model('Wins', Wins);
