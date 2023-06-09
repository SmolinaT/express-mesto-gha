const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const router = require('./routes/routes');
const centralizedError = require('./middlewares/centralized-error');

mongoose.connect('mongodb://127.0.0.1/mestodb');

const app = express();

app.use(express.json());

app.use(router);
app.use(errors());

app.use(centralizedError);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
