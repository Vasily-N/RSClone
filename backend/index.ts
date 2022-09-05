import express from 'express';
import mongoose, { ConnectOptions } from 'mongoose';
import cors from 'cors';
import router from './src/router';

const port = 5000;
const LOGIN_PASSWORD = 'admin:admin';
const URL_DB = `mongodb+srv://${LOGIN_PASSWORD}@atlascluster.hi1wyqs.mongodb.net/?retryWrites=true&w=majority`;

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', router);

export interface TypedRequestBody<T> extends express.Request {
  body: T
}

export type ResponseType = express.Response;

async function startClone() {
  try {
    await mongoose.connect(URL_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);
    app.listen(process.env.PORT || port, () => console.log(`server run, port ${port}`));
  } catch (error) {
    console.log(error);
  }
}

startClone();
