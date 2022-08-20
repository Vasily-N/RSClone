import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import router from './src/registration/router';
import routerBorder from './src/lead-borders/routerBorder';

const port = 5000;
const LOGIN_PASSWORD = 'admin:admin';
const URL_DB = `mongodb+srv://${LOGIN_PASSWORD}@atlascluster.hi1wyqs.mongodb.net/?retryWrites=true&w=majority`;

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', router);
app.use('/api', routerBorder);

export interface TypedRequestBody<T> extends express.Request {
  body: T
}

export type ResponseType = express.Response;

async function startClone() {
  try {
    await mongoose.connect(URL_DB);
    app.listen(port, () => console.log(`server run, port ${port}`));
  } catch (error) {
    console.log(error);
  }
}

startClone();
