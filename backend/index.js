import exppress from 'express';
import mongoose from 'mongoose';

const port = 5000;
const URL_DB = `mongodb+srv://admin:admin@atlascluster.hi1wyqs.mongodb.net/?retryWrites=true&w=majority`;

const app = exppress();
app.use(exppress.json());

app.post('/', (request, response) => {
  console.log(request.body);
  response.status(200).json('run')
});

async function startClone() {

  try {
    await mongoose.connect(URL_DB, {useUnifiedTopology: true, useNewUrlParser: true});
    app.listen(port, () => console.log('server run, port ' + port));
  } catch (error) {
    console.log(error);
  }

};

startClone();
