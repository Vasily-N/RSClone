import exppress from 'express';
import mongoose from 'mongoose';
// import cors from 'cors';
import cors from 'cors';
import router from './registration/router.js';

const port = 5000;
const LOGIN_PASSWORD = 'admin:admin';
const URL_DB = `mongodb+srv://${LOGIN_PASSWORD}@atlascluster.hi1wyqs.mongodb.net/?retryWrites=true&w=majority`;

// const cors = require('cors');

const app = exppress();
app.use(exppress.json());
app.use('/api', router);
app.use(cors({
  methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
  origin: '*',
}));
// app.options('*', cors());
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
