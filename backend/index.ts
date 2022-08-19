import exppress from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import router from './src/registration/router';

const port = 5000;
const LOGIN_PASSWORD = 'admin:admin';
const URL_DB = `mongodb+srv://${LOGIN_PASSWORD}@atlascluster.hi1wyqs.mongodb.net/?retryWrites=true&w=majority`;

const app = exppress();
app.use(cors());
app.use(exppress.json());
app.use('/api', router);

async function startClone() {
  try {
    await mongoose.connect(URL_DB);
    app.listen(port, () => console.log(`server run, port ${port}`));
  } catch (error) {
    console.log(error);
  }
}

startClone();
