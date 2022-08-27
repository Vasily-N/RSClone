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

export interface IWins{
  name: string,
  win: string,
}

export interface IWinsId {
  _id?: string;
  name: string,
  win: string,
}

const Times = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    time: { type: String, required: true },
  },
);

const Wins = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    win: { type: String, required: true },
  },
);

export const TimesScheme = mongoose.model('Times', Times);
export const WinsScheme = mongoose.model('Wins', Wins);
