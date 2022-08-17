import exppress from 'express';
import mongoose from 'mongoose';
import router from './registration/router.js';

const port = 5000;
const LOGIN_PASSWORD = 'admin:admin';
const URL_DB = `mongodb+srv://${LOGIN_PASSWORD}@atlascluster.hi1wyqs.mongodb.net/?retryWrites=true&w=majority`;

const app = exppress();
app.use(exppress.json());
app.use('/api', router);
// app.use('/users', router); // create userrouter

async function startClone() {
  try {
    await mongoose.connect(URL_DB, { useUnifiedTopology: true, useNewUrlParser: true });
    app.listen(port, () => console.log(`server run, port ${port}`));
  } catch (error) {
    console.log(error);
  }
}

startClone();
