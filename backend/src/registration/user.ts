import mongoose from 'mongoose';

export interface IModelUser {
  name: string,
  password: string,
}

const User = new mongoose.Schema(
  {
    name: { type: String, required: true },
    password: { type: String, required: true },
  },
);

export default mongoose.model('User', User);
