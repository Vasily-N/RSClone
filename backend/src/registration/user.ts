import mongoose from 'mongoose';

const User = new mongoose.Schema(
  {
    name: { type: String, required: true },
    password: { type: String, required: true },
  },
);

export default mongoose.model('User', User);
